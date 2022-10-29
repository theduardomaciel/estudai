import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// API
import axios, { AxiosError } from 'axios';
import { getAPIClient } from '../../../lib/api';

// Types
import { Credentials } from 'google-auth-library';
import prisma from '../../../lib/prisma';
import { setCookie } from 'nookies';

// Middlewares
import cors from "cors";
import refreshToken from '../../../services/refreshToken';

const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .post(async (req, res) => {
        const { meta, userId } = req.body;

        console.log(req.cookies);

        const googleRefreshToken = req.cookies['auth.googleRefreshToken'];
        const appToken = req.cookies['auth.token'];

        const api = getAPIClient(undefined, appToken)

        async function returnURL(token: string) {
            const body = JSON.stringify(meta);
            const response = await axios.post(url, body, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            const googleSessionUrl = response.headers.location;
            console.log("O link da seção do Google para upload foi obtido com sucesso!")
            res.status(200).json(googleSessionUrl)
        }

        if (meta) {
            try {
                const googleToken = req.cookies['auth.googleAccessToken'] as string;
                await returnURL(googleToken)
            } catch (err: any) {
                const error = err as AxiosError;
                if (error.response?.status == 401) {
                    const newAccessToken = await refreshToken(res, userId, googleRefreshToken as string)
                    if (newAccessToken) {
                        await returnURL(newAccessToken);
                    } else {
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
        console.log(err)
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});