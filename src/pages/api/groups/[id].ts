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
        const groupId = parseInt(req.query.id as string);
        const userId = parseInt(req.body.userId);

        if (!userId || typeof userId === "string") {
            console.log('O ID do usuário não foi informado corretamente.')
            res.status(400).json({ error: "User id was not given correctly." })
        }

        if (userId) {
            try {
                await prisma.group.update({
                    where: {
                        id: groupId
                    },
                    data: {
                        users: {
                            disconnect: {
                                id: userId
                            }
                        }
                    },
                })
                res.status(200).json({ success: "User was removed from group with success!" })
            } catch (err: any) {
                console.log(err)
                res.status(400).json({ error: "One or more body elements were incorrectly written.", serverError: err })
            }
        } else {
            try {
                const group = await prisma.group.findUnique({
                    where: {
                        id: groupId
                    }
                })

                if (group?.admins.indexOf(userId) === -1) {
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
        }
    })
    .delete(async (req, res) => {
        const groupId = parseInt(req.query.id as string);

        /* const group = await prisma.group.findUnique({
            where: {
                id: groupId
            }
        })

        if (group?.admins.indexOf(userId) === -1) {
            res.status(400).json({ error: "You have not enough permissions for updating group info." })
        } */
        res.status(401).json({ error: 'There is not possible to delete a group for now.' })
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
