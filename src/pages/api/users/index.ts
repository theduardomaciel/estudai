import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import cors from "cors";

// Services
import prisma from '../../../lib/prisma';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .get(async (req, res) => {
        try {
            const users = await prisma.user.findMany({})

            if (users) {
                res.status(200).json(users);
            }
        } catch (error) {
            console.log(error)
            res.status(500)
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
