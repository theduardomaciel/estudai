import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

// API
import prisma from '../../../lib/prisma';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .post(async (req, res) => {
        const userId = parseInt(req.body.userId);
        console.log(userId)

        if (!userId || typeof userId === "string") {
            console.log('O ID do usuário não foi informado corretamente.')
            res.status(400).json({ error: "UserId missing." })
        }

        const hasAttachments = req.body.attachments && req.body.attachments.length > 0
        const attachments = hasAttachments ? req.body.attachments : []

        const links = req.body.links && req.body.links.length > 0 ? req.body.links : []
        const date = new Date(req.body.date).toISOString();

        console.log(req.body)

        const { type, storage } = req.body;

        const storageConnection = storage !== 'account' ? {
            connect: {
                id: parseInt(storage)
            }
        } : {}

        try {
            if (type === "event") {
                const task = await prisma.task.create({
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

                res.status(200).json(task)
            } else if (type === 'av1' || type === 'av2' || type === 'recuperation') {
                const subjects = req.body.subjects;
                const maxScore = parseInt(req.body.questionsAmount) ? parseInt(req.body.questionsAmount) : 0;
                const contents = req.body.contents.map((content: string, index: number) => content ? content : "");

                const task = await prisma.task.create({
                    data: {
                        createdBy: {
                            connect: { id: userId }
                        },
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

                res.status(200).json(task)
            } else {
                const subjects = req.body.subjects.map((subject: string, index: number) => parseInt(subject));
                const maxScore = parseInt(req.body.maxScore) ? parseInt(req.body.maxScore) : 0;

                const task = await prisma.task.create({
                    data: {
                        createdBy: {
                            connect: { id: userId }
                        },
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
                })

                res.status(200).json(task)
            }

        } catch (err: any) {
            console.log(err)
            res.status(400).json({ error: "One or more body elements were incorrectly written.", serverError: err })
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
