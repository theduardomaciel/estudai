import { NextApiRequest, NextApiResponse } from "next";
import { Middleware, Next } from "next-api-route-middleware";

// Types
import { Session } from "./getGoogleUrlSession";

// API
import { googleApi } from "../lib/googleApi";
const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

export type NextApiRequestWithBodyData = NextApiRequest & Session;

export const sendChunksToDrive: Middleware<NextApiRequestWithBodyData> = async (req, res, next: Next) => {
    const start = req.body.start; // starting index of the chunk
    const end = req.body.end; // end index of the chunk
    const length = req.contentLength; // length of the entire file
    const url = req.sessionUrl; // google resumable session URL

    try {
        const headers = {
            'Content-Length': req.files.blob.size,
            'Content-Range': `bytes ${start}-${end - 1}/${length}`,
        };
        const contentOfChunk = req.files.blob.data
        await googleApi.put(url, { contentOfChunk }, { headers: headers })
        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' })
    }
};