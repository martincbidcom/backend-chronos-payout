import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { readFileSync } from 'fs';
import * as https from 'https';
import { DoRequestDto } from 'src/common/dto/bind.dto';
import { BindRequestInterface } from 'src/common/interfaces/bind.interface';
import { ProcessLog } from 'src/common/utils/enum';
import { TempLogService } from 'src/temp-log/temp-log.service';

@Injectable()
export class BindService {
    private httpsAgent: https.Agent;
    private token: string;
    private timeTokenExpirate: Date;
    private URL = process.env.URL_BIND;
    private BANK_ID = process.env.BANK_ID_BIND;
    private ACCOUNT_ID = process.env.ACCOUNT_ID_BIND;
    private VIEW_ID = process.env.VIEW_ID_BIND;

    constructor(private tempLogService: TempLogService) { }

    async requestLogin() {
        try {
            const data = {
                username: process.env.USERNAME_BIND,
                password: process.env.PASSWORD_BIND,
            };

            const config = {
                method: 'post',
                url: process.env.URL_BIND + '/login/jwt',
                data,
            };

            if (process.env.CLIENT_CERTIFICATE && process.env.CLIENT_KEY) {
                this.httpsAgent = new https.Agent({
                    cert: readFileSync(process.env.CLIENT_CERTIFICATE),
                    key: readFileSync(process.env.CLIENT_KEY),
                });

                config['httpsAgent'] = this.httpsAgent;
            }

            const response = await axios(config);

            const timeExpire = new Date(
                new Date().getTime() + response.data.expires_in * 1000,
            );

            this.timeTokenExpirate = timeExpire;

            this.token = response.data.token;

            return response.data.token;
        } catch (error) {
            await this.tempLogService.saveTempLog({
                process: ProcessLog.BIND,
                method: 'requestLogin => Obtencion de token',
                description:
                    'Error en la optencion de token' +
                    JSON.stringify(error?.response?.data ?? error?.response),
            });

            throw new Error('Error en autenticacion de BIND.');
        }
    }

    async checkTokenAndReconnect(expirationDate: Date) {
        const currentTime = new Date().getTime();
        const expirationTime = expirationDate.getTime();
        const oneMinuteInMillis = 60 * 1000;

        if (expirationTime - currentTime <= oneMinuteInMillis) {
            await this.tempLogService.saveTempLog({
                process: ProcessLog.BIND,
                method: 'checkTokenAndReconnect => tiempo de expiracion ',
                description: 'token Vencido',
            });
            await this.requestLogin();
        }
    }

    async getToken() {
        if (!this.token) {
            return await this.requestLogin();
        }
        await this.checkTokenAndReconnect(this.timeTokenExpirate);
        return this.token;
    }
    /**
     * Executes a transaction to the specified destination using the specified parameters.
     *
     * @param destinationCbu - The CBU of the destination account.
     * @param amount - The amount of the transaction.
     * @param concept - The description of the transaction.
     * @param origin_id - The ID of the origin account.
     * @param origin_debit_cvu - The CVU of the origin debit card.
     * @returns A promise that resolves to the response from the BIND API.
     */
    async doTransaction(body: DoRequestDto) {
        try {
            const { destinationCbu, amount } = body;

            const params: BindRequestInterface = {
                to: {
                    cbu: destinationCbu,
                },
                value: {
                    currency: 'ARS',
                    amount: amount.toFixed(2),
                },
                concept: 'VAR',
                origin_id: await this.generateBindTransactionOriginID(body.idTransaction),
                origin_debit: {
                    cvu: process.env.CVU_DEBITO_BIND,
                },
            };

            const headers = {
                Authorization: `JWT ${await this.getToken()}`
            }

            const url: string = `${this.URL}/banks/${this.BANK_ID}/accounts/${this.ACCOUNT_ID}/${this.VIEW_ID}/transaction-request-types/TRANSFER-CVU/transaction-requests`;

            const config: AxiosRequestConfig = {
                method: 'POST',
                url,
                data: params,
                headers
            };
            const response = await axios(config);

            return response.data;
        } catch (error) {
            await this.tempLogService.saveTempLog({
                process: ProcessLog.BIND,
                method: 'doTransaction => generar transaccion',
                description:
                    'Error al generar transaccion' +
                    JSON.stringify(error?.response?.data ?? error?.response),
            });
            throw new Error('Error en aplicar la transacción al BIND.');
        }
    }

    async generateBindTransactionOriginID(transactionId: string | number) {
        return `CHR${transactionId.toString().padStart(10, '0')}`;
    }
}
