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
        console.log(req.body)
        try {
            const userId = parseInt(req.body.userId);
            console.log(userId)

            if (!userId || typeof userId === "string") {
                console.log('O ID do usuário não foi informado corretamente.')
                res.status(400).json({ error: "User id was not given correctly." })
            }

            const { description, condition, price, whatsApp, phone, email } = req.body;

            const announcement = await prisma.announcement.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    description: description,
                    materialCondition: condition,
                    materialPrice: price ? parseInt(price) : 0,
                    whatsAppNumber: whatsApp,
                    phoneNumber: phone,
                    email: email
                },
            })
            res.status(200).json(announcement)
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
