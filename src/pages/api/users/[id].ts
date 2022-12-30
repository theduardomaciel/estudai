import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import cors from "cors";
import prisma from '../../../lib/prisma';
import { User } from '@prisma/client';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .get(async (req, res) => {
        const { id } = req.query;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(id as string)
                },
                include: {
                    tasks: true,
                    groups: true,
                }
            }) as User;
            if (user && user !== null) {
                //console.log("Usuário obtido com sucesso!")
                return user;
            } else {
                console.log("❌ Não foi possível obter o usuário.")
                return null;
            }
            console.log(user, "🐶 Usuário obtido com sucesso!")
            res.status(200).json(user);
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: error })
        }
    })
    .patch(async (req, res) => {
        const { id } = req.query;
        const { name, email, avatar } = req.body;

        if (!name && !email && !avatar) {
            console.log("❌ Não foi possível atualizar o usuário.")
            res.status(400).send({ error: "No info provided" })
        }

        const splitName = name && name.split(" ");
        const firstName = splitName && splitName[0];
        const lastName = splitName && splitName.length > 1 ? name.split(" ").slice(1).join(" ") : (name ? "" : undefined);

        try {
            const user = await prisma.user.update({
                where: {
                    id: parseInt(id as string)
                },
                data: {
                    firstName: firstName || undefined,
                    lastName: lastName === undefined ? undefined : lastName,
                    avatar: avatar || undefined,
                    email: email || undefined,
                }
            })
            if (user && user !== null) {
                console.log("Usuário atualizado com sucesso!")
                res.status(200).json(user);
            } else {
                console.log("❌ Não foi possível atualizar o usuário.")
                return null;
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: error })
        }
    })
    .delete(async (req, res) => {
        const { id } = req.query;
        try {
            await prisma.user.delete({
                where: {
                    id: parseInt(id as string)
                }
            })
            console.log("Usuário deletado com sucesso!")
            res.status(200).json({ message: "Usuário deletado com sucesso!" });
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: error })
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
