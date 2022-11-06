import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

// API
import prisma from '../../../lib/prisma';
import getUserIdByToken from '../../../services/getUserIdByToken';
import { Subject } from '@prisma/client';

export function getDataFromRequestBody(req: NextApiRequest) {
    // General Props
    const date = req.body.date ? new Date(req.body.date).toISOString() : null;
    const hasAttachments = req.body.attachments && req.body.attachments.length > 0
    const attachments = hasAttachments ? req.body.attachments : []
    const links = req.body.links && req.body.links.length > 0 ? req.body.links : []
    const subjects = req.body.subjects;

    // Specific Props
    const { title, address, type, mode, storage } = req.body;
    const description = req.body.description ? req.body.description : null;

    const storageConnection = storage !== 'account' ? {
        connect: {
            id: parseInt(storage)
        }
    } : {}

    const contents = req.body.contents ? req.body.contents : {};

    const questionsAmount = req.body.questionsAmount && parseInt(req.body.questionsAmount) ? parseInt(req.body.questionsAmount) : null;
    const maxScore = req.body.maxScore & parseInt(req.body.maxScore) ? parseInt(req.body.maxScore) : 0;

    return { date, description, attachments, links, subjects, title, address, type, mode, storageConnection, contents, questionsAmount, maxScore }
}

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .post(async (req, res) => {
        const { ['auth.token']: token } = req.cookies;
        const userId = await getUserIdByToken(token as string) as number;

        if (!userId || typeof userId === "string") {
            console.log('O ID do usuário não foi obtido corretamente.')
            res.status(400).json({ error: "UserId missing." })
        }

        const { date, description, attachments, links, subjects, title, address, type, mode, storageConnection, contents, questionsAmount, maxScore } = getDataFromRequestBody(req);

        /* console.log(contents, JSON.stringify(contents)) */

        try {
            const task = await prisma.task.create({
                data: {
                    createdBy: {
                        connect: { id: userId }
                    },
                    type: type,
                    date: date ? date : undefined,
                    description: description,
                    subjects: subjects && subjects.length === 1 ?
                        {
                            connect: {
                                id: subjects[0]
                            }
                        } : subjects.length > 1 ?
                            {
                                connect: subjects.map((subject: Subject) => {
                                    return {
                                        id: subject.id
                                    }
                                })
                            }
                            :
                            {},
                    attachments: attachments.length > 0 ?
                        {
                            create: attachments.map((attachment: any) => {
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
                        {},
                    links: links,
                    mode: mode,
                    questionsAmount: questionsAmount,
                    maxScore: maxScore,
                    contents: JSON.stringify(contents),
                    title: title ? title : null,
                    address: address ? address : null,
                    group: storageConnection,

                }
            })
            res.status(200).json(task)
        } catch (err: any) {
            console.log(err)
            res.status(400).json({ error: "One or more body elements were incorrectly written.", serverError: err })
        }
    })


/* if (type === "event") {
            

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
        } */

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});
