import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

import prisma from '../../../lib/prisma';
import { AxiosError } from 'axios';

// API

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .patch(async (req, res) => {
        const { id } = req.query;
        const { userId } = req.body;

        const parsedId = parseInt(id as string)
        const parsedUserId = parseInt(userId as string);

        try {
            if (parsedId) {
                const taskThatHasInteracted = await prisma.user.findFirst({
                    where: {
                        tasksInteracted: {
                            id: parsedId
                        }
                    }
                })

                if (taskThatHasInteracted !== null) {
                    try {
                        await prisma.task.update({
                            where: {
                                id: parsedId,
                            },
                            data: {
                                interactedBy: {
                                    disconnect: {
                                        id: parsedUserId
                                    }
                                }
                            }
                        })
                        const message = `😊 Removed interaction from user with ID ${userId} from task ${id}.`;
                        console.log(message)
                        res.status(200).json({ removed: message })
                    } catch (error) {
                        console.log(error)
                        res.status(404).json({ error: 'Invalid task or user id.' })
                    }
                } else {
                    try {
                        await prisma.task.update({
                            where: {
                                id: parsedId,
                            },
                            data: {
                                interactedBy: {
                                    connect: {
                                        id: parsedUserId
                                    }
                                }
                            }
                        })
                        const message = `😊 Added interaction of user with ID ${userId} from task ${id}.`
                        console.log(message)
                        res.status(200).json({ added: message })
                    } catch (error) {
                        console.log(error)
                        res.status(404).json({ error: 'Invalid task or user id.' })
                    }
                }
            } else {
                console.log(parsedUserId, userId)
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
