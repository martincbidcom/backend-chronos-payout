import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync } from 'fs';
import * as https from 'https';

@Injectable()
export class BindService {
    private httpsAgent: https.Agent
    constructor() { }

    public async requestLogin() {
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

            return response.data

        } catch (error) {
            console.log(error)
            throw new Error('Error en autenticacion de BIND.')
        }
    }
}
