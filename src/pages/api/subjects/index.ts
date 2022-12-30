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
    .post(async (req, res) => {
        const { ['estudai.token']: token } = req.cookies;
        const userId = req.query.id ? parseInt(req.query.id as string) : await getUserIdByToken(token as string) as number;

        const { name, icon } = req.body;

        try {
            if (userId && name && icon) {
                const newSubject = await prisma.subject.create({
                    data: {
                        createdByUser: {
                            connect: {
                                id: userId
                            }
                        },
                        name: name,
                        icon: icon
                    }
                })
                res.status(200).json(newSubject)
            } else {
                res.status(501).json({ error: "Malformed body." })
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
