import { NextApiRequest, NextApiResponse } from "next";
import { Middleware, Next, use } from "next-api-route-middleware";
import multer from 'multer';

// Types
import { Session } from "../../../middlewares/getGoogleUrlSession";

// API
import { getGoogleAPIClient } from "../../../lib/googleApi";

// Middlewares
import { captureErrors } from "../../../middlewares/captureErrors";
import { allowMethods } from "../../../middlewares/allowMethods";

export type NextApiRequestWithBodyData = NextApiRequest & Session;

async function handler(req: NextApiRequestWithBodyData, res: NextApiResponse) {
    // start = starting index of the chunk
    // end = end index of the chunk
    // length = length of the entire file
    // sessionUrl = google resumable session URL

    const googleApi = getGoogleAPIClient()

    const start = req.body.start; // starting index of the chunk
    const end = req.body.end; // end index of the chunk

    console.log(start, end)
    console.log(req.files)
    console.log(req.files.blob.data)

    return res.status(200).send(req.body)

    const token = req.cookies['auth.googleAccessToken'];

    /* try {
        const headers = {
            'Content-Length': req.files.blob.size,
            'Content-Range': `bytes ${start}-${end - 1}/${length}`,
            'Authorization': `Bearer ${token}`
        };
        const contentOfChunk = req.files.blob.data
        const response = await googleApi.put(sessionUrl, { contentOfChunk }, { headers: headers })
        return res.status(response.status).send({ response })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' })
    } */
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
}

export default use(captureErrors, allowMethods(['POST']), handler);