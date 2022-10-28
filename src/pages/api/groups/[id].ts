import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

// API
import prisma from '../../../lib/prisma';
import getGroup from '../../../services/getGroup';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .get(async (req, res) => {
        const { id } = req.query;
        try {
            console.log(id)
            const group = await getGroup(undefined, id as string)
            console.log(group, "🐶 Grupo obtido com sucesso!")
            res.status(200).json(group);
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: error })
        }
    })
    .patch(async (req, res) => {
        const groupId = parseInt(req.query.id as string);
        const userId = parseInt(req.body.userId);

        if (!userId || typeof userId === "string") {
            console.log('O ID do usuário não foi informado corretamente.')
            res.status(400).json({ error: "User id was not given correctly." })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                groups: true
            }
        })

        if (user) {
            const userIsInGroup = user.groups.find((group, i) => group.id === groupId) ? true : false;

            if (userIsInGroup) {
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
                    res.status(400).json({ error: "There was not possible to remove user from group.", serverError: err })
                }
            } else {
                try {
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            users: {
                                connect: {
                                    id: userId
                                }
                            }
                        },
                    })
                    res.status(200).json({ success: "User was added to group with success!" })
                } catch (err: any) {
                    console.log(err)
                    res.status(400).json({ error: "There was not possible to add user to group.", serverError: err })
                }
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
