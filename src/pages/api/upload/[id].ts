import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import cors from "cors";

// API
import axios, { AxiosError } from 'axios';

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .delete(async (req, res) => {
        const { id } = req.query;
        const token = req.cookies['auth.googleAccessToken'];

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            console.log(id)
            const response = await axios.delete(`https://www.googleapis.com/drive/v3/files/${id}`, { headers: headers })
            console.log(`Arquivo de id ${id} removido com sucesso!`)

            res.status(200).json({ success: "File removed successfully." })
        } catch (err: any) {
            const error = err as AxiosError;
            if (error.response) {
                res.status(500).json({ error: error.response.statusText })
            }
        }
    })

export const config = {
    api: {
        bodyParser: false
    },
}

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});
