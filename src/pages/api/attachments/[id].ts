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

async function deleteAttachment(token: string, id: string) {
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    console.log(id)

    try {
        try {
            await axios.delete(`https://www.googleapis.com/drive/v3/files/${id}`, { headers: headers })
            console.log(`Arquivo de id ${id} removido com sucesso!`)

            return { code: 200, error: "" };
        } catch (err: any) {
            console.log(err.response)
            return { code: 401, error: err };
        }
    } catch (error: any) {
        console.log(error)
        return { code: 500, error: 'There was not possible to delete the file.' };
    }
}

export async function deleteAttachmentWithGoogleFallback(googleRefreshToken: string, googleAccessToken: string, userId: number, attachmentId: string) {
    console.log(attachmentId)

    const response = await deleteAttachment(googleAccessToken, attachmentId)
    if (response.code === 401) {
        const newAccessToken = await refreshToken(null, userId, googleRefreshToken as string)
        if (newAccessToken) {
            const response = await deleteAttachment(newAccessToken, attachmentId)
            return response;
        } else {
            return { code: 500, error: 'Google refresh and access token expired.' }
        }
    } else {
        return response
    }
}

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
                        attachmentsInteracted: {
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
                                interactedBy: {
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
                                interactedBy: {
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

        if (!attachment) {
            return res.status(401).json({ error: 'It was not possible to find the attachment' })
        }

        if (id) {
            const googleRefreshToken = req.cookies['auth.googleRefreshToken'] as string;
            const token = req.cookies['auth.googleAccessToken'] as string;
            const userId = parseInt(req.cookies['app.userId'] as string);

            const response = await deleteAttachmentWithGoogleFallback(googleRefreshToken, token, userId, attachment?.fileId as string);

            if (response.code === 200) {
                res.status(200).json({ success: "File removed successfully." })
            } else {
                res.status(500).json({ error: response.error })
            }
        } else {
            res.status(401).json({ error: 'The id was not provided.' })
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
