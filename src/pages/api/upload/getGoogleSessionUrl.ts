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
import getUserIdByToken from '../../../services/getUserIdByToken';

const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .post(async (req, res) => {
        const { meta } = req.body;

        const { ['estudai.token']: token, ['auth.googleRefreshToken']: googleRefreshToken } = req.cookies;
        const userId = await getUserIdByToken(token as string) as number;

        async function getFolderId(token: string) {
            const folderQueryResponse = await axios.get(`https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.folder\'`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })

            console.log(folderQueryResponse.data, 'procurando pasta')

            if (folderQueryResponse.data.files.length > 0) {
                console.log("O usuário já possui uma pasta, portanto, estamos adicionando o arquivo a ela.", folderQueryResponse.data.files[0].id)
                return folderQueryResponse.data.files[0].id
            } else {
                const folderMeta = {
                    name: 'anexos do estudaí :)',
                    mimeType: 'application/vnd.google-apps.folder',
                };

                const response = await axios.post(`https://www.googleapis.com/drive/v3/files`, JSON.stringify(folderMeta), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                console.log("A pasta do estudaí foi criada com sucesso!", response.data.id)
                return response.data.id;
            }
        }

        async function returnURL(token: string, folderId: string) {
            meta.parents = [folderId]
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
                const folderId = await getFolderId(googleToken);
                await returnURL(googleToken, folderId)
            } catch (err: any) {
                const error = err as AxiosError;
                if (error.response?.status == 401) {
                    const newAccessToken = await refreshToken(res, userId, googleRefreshToken as string)
                    if (newAccessToken) {
                        const folderId = await getFolderId(newAccessToken);
                        await returnURL(newAccessToken, folderId);
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