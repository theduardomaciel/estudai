import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';

// API
import prisma from '../../../lib/prisma';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    //.use(isAuthenticated)
    .patch(async (req, res) => {
        console.log(req.body)
        try {
            const userId = parseInt(req.body.userId);
            console.log(userId)
            const groupId = parseInt(req.body.groupId);

            if (!userId || typeof userId === "string") {
                console.log('O ID do usuário não foi informado corretamente.')
                res.status(400).json({ error: "User id was not given correctly." })
            }

            const group = await prisma.group.findUnique({
                where: {
                    id: groupId
                }
            })

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (group?.admins.indexOf(user?.id as number) === -1) {
                res.status(400).json({ error: "You have not enough permissions for updating group info." })
            }

            const { name, isPrivate } = req.body;

            const task = await prisma.group.update({
                where: {
                    id: groupId
                },
                data: {
                    pinnedMessage: req.body.pinnedMessage
                },
            })
            res.status(200).json(task)
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
