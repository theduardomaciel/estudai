import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

import prisma from '../../../lib/prisma';
import { AxiosError } from 'axios';
import getUserIdByToken from '../../../services/getUserIdByToken';
import { getAPIClient } from '../../../lib/api';
import { deleteAttachmentWithGoogleFallback } from '../attachments/[id]';
import { getDataFromRequestBody } from './new';
import { Subject } from '../../../types/Subject';

// API

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .patch(async (req, res) => {
        const { id } = req.query;
        const { userId, existingTaskId, attachments, links } = req.body;

        const parsedId = parseInt(id as string)
        const parsedUserId = parseInt(userId as string);

        if (existingTaskId && attachments) {
            if (attachments && attachments.length > 0) {
                await prisma.task.update({
                    where: {
                        id: parseInt(existingTaskId)
                    },
                    data: {
                        attachments: {
                            create: attachments.map((attachment: any, index: number) => {
                                return {
                                    uploadedBy: {
                                        connect: {
                                            id: userId
                                        }
                                    },
                                    ...attachment
                                }
                            })
                        }
                    }
                })
            }

            if (links && links.length > 0) {
                await prisma.task.update({
                    where: {
                        id: parseInt(existingTaskId)
                    },
                    data: {
                        links: {
                            push: links
                        }
                    }
                })
            }

            console.log("Attachment adicionado à tarefa existente.")
            return res.status(200).json({ success: "Attachment added to existing task successfully." })
        }

        try {
            if (userId) {
                if (parsedId) {
                    const task = await prisma.task.findUnique({
                        where: {
                            id: parsedId
                        },
                        include: {
                            interactedBy: true
                        }
                    })

                    const hasInteracted = task?.interactedBy.find((user, i) => user.id === parsedUserId) ? true : false;

                    if (hasInteracted) {
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
            } else {
                const { ['auth.token']: token } = req.cookies;
                const userId = await getUserIdByToken(token as string);

                console.log("Atualizando dados da tarefa de id :", id)

                if (userId) {
                    const { date, description, subjects, title, address, type, mode, contents, questionsAmount, maxScore } = getDataFromRequestBody(req);

                    try {
                        await prisma.task.update({
                            where: {
                                id: parsedId
                            },
                            data: {
                                createdBy: {
                                    connect: { id: userId }
                                },
                                type: type ? type : undefined,
                                date: date ? date : undefined,
                                description: description ? description : undefined,
                                subjects: subjects && subjects.length > 0 ? {
                                    connect: subjects.map((subject: Subject) => {
                                        return {
                                            id: subject.id
                                        }
                                    })
                                }
                                    :
                                    {},
                                mode: mode ? mode : undefined,
                                questionsAmount: questionsAmount ? questionsAmount : undefined,
                                maxScore: maxScore ? maxScore : undefined,
                                contents: JSON.stringify(contents),
                                title: title ? title : undefined,
                                address: address ? address : undefined,
                            }
                        })
                        res.status(200).json({ success: "The task was updated successfully." })
                    } catch (err: any) {
                        console.log(err)
                        res.status(400).json({ error: "One or more body elements were incorrectly written.", serverError: err })
                    }
                } else {
                    res.status(400).json({ error: "There is not user id." })
                }
            }
        } catch (err: any) {
            const error = err as AxiosError;
            if (error.response) {
                res.status(500).json({ error: error.response.statusText })
            }
        }
    })
    .delete(async (req, res) => {
        const taskId = parseInt(req.query.id as string);
        const { ['auth.token']: token } = req.cookies;

        const userId = await getUserIdByToken(token as string) as number;

        const googleRefreshToken = req.cookies['auth.googleRefreshToken'] as string;
        const googleAccessToken = req.cookies['auth.googleAccessToken'] as string;

        async function deleteAttachment(attachmentId: string) {
            console.log("Excluindo attachment.")
            try {
                const response = await deleteAttachmentWithGoogleFallback(googleRefreshToken, googleAccessToken, userId, attachmentId)
                if (response.code === 200) {
                    console.log("Attachment deletado", attachmentId)
                } else {
                    console.log("Server error.")
                }
            } catch (error: any) {
                console.log(error.code)
            }
        }

        if (!userId) {
            res.status(400).json({ error: "We couldn't get enough info." })
        } else {
            const task = await prisma.task.findUnique({
                where: {
                    id: taskId
                },
                include: {
                    createdBy: true,
                    attachments: true
                }
            })

            console.log("Iniciando processo de exclusão da tarefa de id: ", taskId)

            if (task && task.createdBy && task.createdBy.id !== userId) {
                res.status(401).json({ error: "You have not enough permissions for updating task info." })
            } else if (task) {
                try {
                    await task.attachments.forEach(async (attach, i) => await deleteAttachment(attach.fileId))
                    await prisma.task.delete({
                        where: {
                            id: taskId
                        }
                    })
                    res.status(200).json({ success: 'The task and the attachments were deleted successfully.' })
                } catch (error) {
                    res.status(500).json({ error: 'There was not possible to delete the task.' })
                }
            } else {
                res.status(500).json({ error: 'There was not possible to delete the task.' })
            }
        }
    })

/* if (type === "event") {
                        const task = await prisma.task.update({
                            where: {
                                id: parseInt(id as string)
                            },
                            data: {
                                createdBy: {
                                    connect: { id: userId }
                                },
                                date: date,
                                type: req.body.type,
                                description: req.body.description,
                                title: req.body.title,
                                address: req.body.address,
                                links: links,
                                group: storageConnection,
                                attachments: hasAttachments ?
                                    {
                                        create: attachments.map((attachment: any, index: number) => {
                                            return {
                                                uploadedBy: {
                                                    connect: {
                                                        id: userId
                                                    }
                                                },
                                                ...attachment
                                            }
                                        })
                                    }
                                    :
                                    {}
                            }
                        })

                        console.log("Activity updated successfully!")
                        res.status(200).json(task)
                    } else if (type === 'av1' || type === 'av2' || type === 'recuperation') {
                        const subjects = req.body.subjects;
                        const maxScore = parseInt(req.body.questionsAmount) ? parseInt(req.body.questionsAmount) : 0;
                        const contents = req.body.contents.map((content: string, index: number) => content ? content : "");

                        const task = await prisma.task.update({
                            where: {
                                id: parseInt(id as string)
                            },
                            data: {
                                date: date,
                                type: req.body.type,
                                subjects: subjects,
                                description: req.body.description,
                                questionsAmount: maxScore,
                                contents: contents,
                                links: links,
                                group: storageConnection,
                                attachments: hasAttachments ?
                                    {
                                        create: attachments.map((attachment: any, index: number) => {
                                            return {
                                                uploadedBy: {
                                                    connect: {
                                                        id: userId
                                                    }
                                                },
                                                ...attachment
                                            }
                                        })
                                    }
                                    :
                                    {}
                            }
                        })

                        console.log("Test updated successfully!")
                        res.status(200).json(task)
                    } else {
                        const subjects = req.body.subjects.map((subject: string, index: number) => parseInt(subject));
                        const maxScore = parseInt(req.body.maxScore) ? parseInt(req.body.maxScore) : 0;

                        const task = await prisma.task.update({
                            where: {
                                id: parseInt(id as string)
                            },
                            data: {
                                date: date,
                                type: req.body.type,
                                subjects: subjects,
                                description: req.body.description,
                                mode: req.body.mode,
                                maxScore: maxScore,
                                links: links,
                                group: storageConnection,
                                attachments: hasAttachments ?
                                    {
                                        create: attachments.map((attachment: any, index: number) => {
                                            return {
                                                uploadedBy: {
                                                    connect: {
                                                        id: userId
                                                    }
                                                },
                                                ...attachment
                                            }
                                        })
                                    }
                                    :
                                    {}
                            }
                            console.log("Task updated successfully!")
                            res.status(200).json(task)
                    }
                        }) */

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});
