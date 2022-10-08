import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// API
import axios, { AxiosError } from 'axios';
import { getAPIClient } from '../../../lib/api';

// Types
import { Credentials } from 'google-auth-library';
import prisma from '../../../lib/prisma';

// DB


const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .post(async (req, res) => {
        const { meta, userId } = req.body;

        let googleToken = req.cookies['auth.googleAccessToken'];
        const googleRefreshToken = req.cookies['auth.googleRefreshToken'];
        const appToken = req.cookies['auth.token'];

        const api = getAPIClient(undefined, appToken)

        async function returnURL() {
            const body = JSON.stringify(meta);
            const response = await axios.post(url, body, {
                headers: {
                    'Authorization': `Bearer ${googleToken}`,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            const googleSessionUrl = response.headers.location;
            console.log("O link da seção do Google para upload foi obtido com sucesso!")
            res.status(200).json(googleSessionUrl)
        }

        if (meta) {
            try {
                await returnURL()
            } catch (err: any) {
                const error = err as AxiosError;
                if (error.response?.status == 401) {
                    console.log("O token de acesso ao Google do usuário expirou, obtendo um novo...")

                    try {
                        const response = await api.post(`/auth/google/regenerateCredentials`, { refreshToken: googleRefreshToken })
                        if (response.status === 200) {
                            console.log(`Novas credenciais obtidas com sucesso. Aplicando-as...`)

                            // Obtemos as novas credenciais
                            const newCredentials = response.data as Credentials;
                            console.log(newCredentials, "Novas credenciais.")

                            // Atualizamos o token Google na conta do usuário
                            await prisma.account.update({
                                where: {
                                    userId: parseInt(userId)
                                },
                                data: {
                                    google_access_token: newCredentials.access_token,
                                    google_refresh_token: newCredentials.refresh_token,
                                    expires_at: newCredentials.expiry_date
                                }
                            })

                            // Atualizamos o token Google na função
                            googleToken = newCredentials.access_token as string;

                            await returnURL();
                        } else {
                            res.status(401).send({ error: 'Google refresh and access token expired.' })
                        }
                    } catch (error) {
                        res.status(401).send({ error: 'Google refresh and access token expired.' })
                    }
                }
            }
        } else {
            res.status(500).send({ error: 'No data provided.' })
        }
    })

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});