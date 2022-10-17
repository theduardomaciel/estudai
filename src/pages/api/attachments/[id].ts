import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import prisma from '../../../lib/prisma';
import { AxiosError } from 'axios';

// API

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    //.use(isAuthenticated)
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
                                    connect: {
                                        id: parsedUserId
                                    }
                                }
                            },
                            include: {
                                markedBy: true
                            }
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

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});
