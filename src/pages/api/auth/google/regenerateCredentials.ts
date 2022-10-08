import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

import { UserRefreshClient } from "google-auth-library";

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .post(async (req, res) => {
        try {
            const { refreshToken } = req.body;

            const user = new UserRefreshClient(
                process.env.NEXT_PUBLIC_GOOGLE_ID,
                process.env.GOOGLE_SECRET,
                refreshToken as string,
            );

            const { credentials } = await user.refreshAccessToken(); // obtain new tokens

            res.status(200).json(credentials);
        } catch (error: any) {
            console.log(error.response.data)
            res.status(400).json({ error: error.response.data });
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
