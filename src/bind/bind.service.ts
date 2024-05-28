import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { readFileSync } from 'fs';
import * as https from 'https';
import { DoRequestDto } from 'src/common/dto/bind.dto';
import { BindRequestDto } from 'src/common/interfaces/bind.interface';

@Injectable()
export class BindService {
  private httpsAgent: https.Agent;
  constructor() {}

  public async requestLogin() {
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

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('Error en autenticacion de BIND.');
    }
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
    const {
      destinationCbu,
      amount,
      concept,
      origin_id,
      origin_debit_cvu,
    } = body;
    const params: BindRequestDto = {
      to: {
        cbu: destinationCbu,
      },
      value: {
        currency: 'ARS',
        amount: amount.toFixed(2),
      },
      concept,
    };

    if (origin_id && origin_debit_cvu) {
      params.origin_id = origin_id;
      params.origin_debit = {
        cvu: origin_debit_cvu,
      };
    }

    const bank_id: number = 322;
    const account_id: string = '20-1-685741-1-5';
    const view_id: string = 'OWNER';
    const url: string = `/banks/${bank_id}/accounts/${account_id}/${view_id}/transaction-request-types/TRANSFER-CVU/transaction-requests`;
    const config: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: params,
    };
    // We set the timeout to 0 to always wait for the BIND API response.
    return await axios(config);
  }
}
