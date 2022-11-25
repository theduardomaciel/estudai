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
        const announcementId = parseInt(req.query.id as string);
        const { userDeviceId, isLocked } = req.body;

        try {
            if (userDeviceId) {
                const query = await prisma.announcement.findFirst({
                    where: {
                        visualizationsCount: {
                            has: userDeviceId
                        }
                    }
                })

                if (!query) {
                    await prisma.announcement.update({
                        where: {
                            id: announcementId
                        },
                        data: {
                            visualizationsCount: {
                                push: userDeviceId
                            }
                        },
                    })
                    console.log("User device ID added with success to the announcement!")
                } else {
                    console.log("User already viewed.")
                }
            }
            if (isLocked === true || isLocked === false) {
                await prisma.announcement.update({
                    where: {
                        id: announcementId
                    },
                    data: {
                        isLocked: isLocked
                    },
                })
                console.log(isLocked === true ? "Announcement locked with success!" : "Announcement unlocked with success!")
            }
            res.status(200).json({ success: true });
        } catch (err: any) {
            console.log(err)
            res.status(400).json({ error: "There was not possible to update announcement info.", serverError: err })
        }
    })
    .delete(async (req, res) => {
        const announcementId = parseInt(req.query.id as string);
        const { ['auth.token']: token } = req.cookies;

        const userId = await getUserIdByToken(token as string);

        if (!userId) {
            res.status(400).json({ error: "We couldn't get enough info." })
        } else {
            try {
                await prisma.announcement.delete({
                    where: {
                        id: announcementId
                    }
                })
                res.status(200).json({ error: 'The announcement was deleted successfully.' })
            } catch (error) {
                console.log(error)
                res.status(401).json({ error: 'There was not possible to delete the announcement.' })
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
