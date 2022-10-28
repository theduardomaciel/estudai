import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import cors from "cors";

// Services
import getUser from '../../../services/getUser';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .get(async (req, res) => {
        const { id } = req.query;
        try {
            const user = getUser(parseInt(id as string))
            console.log(user, "🐶 Usuário obtido com sucesso!")
            res.status(200).json(user);
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
