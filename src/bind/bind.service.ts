import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync } from 'fs';
import * as https from 'https';
import { ProcessLog } from 'src/common/utils/enum';
import { TempLogService } from 'src/temp-log/temp-log.service';

@Injectable()
export class BindService {
    private httpsAgent: https.Agent;
    private token: string;
    private timeTokenExpirate: Date;

    constructor(
        private tempLogService: TempLogService
    ) { }

    async requestLogin() {
        try {
            const data = {
                username: process.env.USERNAME_BIND,
                password: process.env.PASSWORD_BIND,
            };

            const config = {
                method: 'post',
                url: process.env.URL_BIND + '/login/jwt',
                data
            }

            if (process.env.CLIENT_CERTIFICATE && process.env.CLIENT_KEY) {
                this.httpsAgent = new https.Agent({
                    cert: readFileSync(process.env.CLIENT_CERTIFICATE),
                    key: readFileSync(process.env.CLIENT_KEY),
                });

                config['httpsAgent'] = this.httpsAgent;
            }

            const response = await axios(config);

            const timeExpire = new Date(
                new Date().getTime() + response.data.expires_in * 1000
            );

            this.timeTokenExpirate = timeExpire;

            this.token = response.data.token;

            return { create_token: response.data.token }

        } catch (error) {
            await this.tempLogService.saveTempLog({
                process: ProcessLog.BIND,
                method: 'requestLogin => Obtencion de token',
                description: 'Error en la optencion de token' + JSON.stringify(error?.response?.data ?? error?.response),
            })

            throw new Error('Error en autenticacion de BIND.')
        }
    }

    async checkTokenAndReconnect(expirationDate: Date) {
        const currentTime = new Date().getTime();
        const expirationTime = expirationDate.getTime();
        const oneMinuteInMillis = 60 * 1000;

        if((expirationTime - currentTime) <= oneMinuteInMillis){
            await this.tempLogService.saveTempLog({
                process: ProcessLog.BIND,
                method: 'checkTokenAndReconnect => tiempo de expiracion ',
                description: 'token Vencido',
            })
            await this.requestLogin()
        };
    }

    async getToken(){
        if (!this.token) {
            return  await this.requestLogin()
        }
        await this.checkTokenAndReconnect(this.timeTokenExpirate)
        return this.token;
    }

}
