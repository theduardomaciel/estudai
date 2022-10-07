import { NextApiRequest, NextApiResponse } from "next";
import { Middleware, Next, use } from "next-api-route-middleware";

// API
import { getGoogleAPIClient } from "../../../lib/googleApi";

// Middlewares
import { captureErrors } from "../../../middlewares/captureErrors";
import { allowMethods } from "../../../middlewares/allowMethods";
import { parseCookies } from "nookies";

const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { meta } = req.body;

    const googleApi = getGoogleAPIClient()

    const token = req.cookies['auth.googleAccessToken'];
    console.log("TOKEN", token)

    if (meta) {
        const body = JSON.stringify(meta);
        try {
            const response = await googleApi.post(url, body, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const googleSessionUrl = response.headers.location;
            res.status(200).json(googleSessionUrl)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Internal Server Error' })
        }
    } else {
        res.status(500).send({ error: 'No data provided.' })
    }
};

export default use(captureErrors, allowMethods(['POST']), handler);