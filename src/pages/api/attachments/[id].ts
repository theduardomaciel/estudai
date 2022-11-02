import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

import prisma from '../../../lib/prisma';
import axios, { AxiosError, AxiosResponse } from 'axios';
import refreshToken from '../../../services/refreshToken';

// API

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .patch(async (req, res) => {
        const { id } = req.query;
        const { userId } = req.body;

        const parsedUserId = parseInt(userId as string);

        try {
            if (id) {
                const userHasInteractedWithAttachment = await prisma.user.findFirst({
                    where: {
                        markedAttachments: {
                            some: {
                                id: id as string
                            }
                        }
                    }
                })

                if (userHasInteractedWithAttachment !== null) {
                    try {
                        await prisma.attachment.update({
                            where: {
                                id: id as string,
                            },
                            data: {
                                markedBy: {
                                    disconnect: { id: parsedUserId }
                                }
                            }
                        })
                        const message = `😊 Unmarked attachment with ID ${id} from user with ID ${userId}.`
                        console.log(message)
                        res.status(200).json({ removed: message })
                    } catch (error) {
                        console.log(error)
                        res.status(404).json({ error: 'Invalid task or user id.' })
                    }
                } else {
                    try {
                        await prisma.attachment.update({
                            where: {
                                id: id as string,
                            },
                            data: {
                                markedBy: {
                                    connect: { id: parsedUserId }
                                }
                            },
                        })

                        const message = `😊 Marked attachment with ID ${id} from user with ID ${userId}.`
                        console.log(message)
                        res.status(200).json({ added: message })
                    } catch (error) {
                        console.log(error)
                        res.status(404).json({ error: 'Invalid task or user id.' })
                    }
                }
            } else {
                res.status(500).json({ error: 'Invalid user id' })
            }
        } catch (err: any) {
            const error = err as AxiosError;
            if (error.response) {
                res.status(500).json({ error: error.response.statusText })
            }
        }
    })
    .delete(async (req, res) => {
        const { id } = req.query;

        const attachment = await prisma.attachment.findUnique({
            where: {
                id: id as string
            }
        })

        async function deleteAttachment(token: string) {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            try {
                const { id } = req.query;
                const token = req.cookies['auth.googleAccessToken'];

                try {
                    console.log(id)
                    const response = await axios.delete(`https://www.googleapis.com/drive/v3/files/${id}`, { headers: headers })
                    console.log(`Arquivo de id ${id} removido com sucesso!`)

                    res.status(200).json({ success: "File removed successfully." })
                } catch (err: any) {
                    const error = err as AxiosError;
                    if (error.response) {
                        res.status(500).json({ error: error.response.statusText })
                    }
                }
            } catch (error) {
                res.status(500).json({ error: 'We could not delete the file.' })
            }
        }

        const googleRefreshToken = req.cookies['auth.googleRefreshToken'];
        const userId = parseInt(req.cookies['app.userId'] as string);

        try {
            const token = req.cookies['auth.googleAccessToken'] as string;
            await deleteAttachment(token)
        } catch (error) {
            const newAccessToken = await refreshToken(res, userId, googleRefreshToken as string)
            if (newAccessToken) {
                await deleteAttachment(newAccessToken)
            } else {
                res.status(401).send({ error: 'Google refresh and access token expired.' })
            }

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
