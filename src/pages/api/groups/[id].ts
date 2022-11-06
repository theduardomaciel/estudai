import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

// API
import prisma from '../../../lib/prisma';
import getGroup from '../../../services/getGroup';
import getUserIdByToken from '../../../services/getUserIdByToken';

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
        const { updateInteraction } = req.body;
        const { ['auth.token']: token } = req.cookies;

        const userId = await getUserIdByToken(token as string) as number;

        if (!userId || typeof userId === "string") {
            console.log('O ID do usuário não foi informado corretamente.')
            res.status(400).json({ error: "We couldn't get user id." })
        }

        const { name, pinnedMessage } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                groups: true,
                groupsInteracted: true
            }
        })

        if (updateInteraction && user) {
            const hasInteracted = user.groupsInteracted.find((group, i) => group.id === groupId) ? true : false;
            if (!hasInteracted) {
                await prisma.group.update({
                    where: {
                        id: groupId
                    },
                    data: {
                        usersThatInteracted: {
                            connect: {
                                id: userId
                            }
                        }
                    },
                })
                console.log("Interação do usuário adicionada ao grupo.")
                res.status(200).json({ interaction: true })
            } else {
                await prisma.group.update({
                    where: {
                        id: groupId
                    },
                    data: {
                        usersThatInteracted: {
                            disconnect: {
                                id: userId
                            }
                        }
                    },
                })
                console.log("Interação do usuário removida do grupo.")
                res.status(200).json({ interaction: false })
            }
        } else if (name || pinnedMessage) {
            try {
                if (pinnedMessage) {
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            pinnedMessage: pinnedMessage,
                            usersThatInteracted: {}
                        },
                    })
                    console.log("Mensagem fixada atualizada.")
                }
                if (name) {
                    await prisma.group.update({
                        where: {
                            id: groupId
                        },
                        data: {
                            name: name
                        },
                    })
                    console.log("Nome do grupo atualizado.")
                }
                res.status(200).json({ success: "Group info updated successfully!" })
            } catch (err: any) {
                console.log(err)
                res.status(400).json({ error: "There was not possible to remove user from group.", serverError: err })
            }
        } else {
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
            }
        }
    })
    .delete(async (req, res) => {
        const groupId = parseInt(req.query.id as string);
        const { ['auth.token']: token } = req.cookies;

        const userId = await getUserIdByToken(token as string);

        if (!userId) {
            res.status(400).json({ error: "We couldn't get enough info." })
        } else {
            const group = await prisma.group.findUnique({
                where: {
                    id: groupId
                },
                include: {
                    admins: true
                }
            })

            if (group && group.admins.find(admin => admin.id === userId) ? false : true) {
                res.status(400).json({ error: "You have not enough permissions for updating group info." })
            } else {
                try {
                    await prisma.group.delete({
                        where: {
                            id: groupId
                        }
                    })
                    res.status(200).json({ error: 'The group was deleted successfully.' })
                } catch (error) {
                    console.log(error)
                    res.status(401).json({ error: 'There was not possible to delete the group' })
                }
            }
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
