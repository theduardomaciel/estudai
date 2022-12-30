import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import cors from "cors";

// Services
import prisma from '../../../lib/prisma';
import getUserIdByToken from '../../../services/getUserIdByToken';
import { Subject } from '@prisma/client';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .get(async (req, res) => {
        const { ['estudai.token']: token } = req.cookies;
        const userId = req.query.id ? await getUserIdByToken(token as string) as number : undefined;

        try {
            const defaultSubjects = await prisma.subject.findMany({
                where: {
                    isDefault: true
                }
            })

            console.log(userId)
            if (userId) {
                const userSubjects = await prisma.subject.findMany({
                    where: {
                        createdByUser: {
                            id: userId
                        }
                    }
                })
                res.status(200).json({ userSubjects: userSubjects, defaultSubjects: defaultSubjects })
            } else {
                res.status(200).json({ defaultSubjects: defaultSubjects })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })

// create a handler from router with custom
// onError and onNoMatch
export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});
