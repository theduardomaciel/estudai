import { NextApiRequest, NextApiResponse } from "next";
import { Middleware, Next } from "next-api-route-middleware";

// API
import { googleApi } from "../lib/googleApi";
const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

export interface Session {
    sessionUrl: string;
    contentLength: any;
    files: any;
}

export type NextApiRequestWithBodyData = NextApiRequest & Session;

export const getGoogleSessionUrl: Middleware<NextApiRequestWithBodyData> = async (req, res, next: Next) => {
    const { meta, contentLength } = req.body;

    if (meta && contentLength) {
        try {
            const response = await googleApi.post(url, {})
            const googleSessionUrl = response.headers.location;

            req.sessionUrl = googleSessionUrl;
            req.contentLength = contentLength;
            return next();
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Internal Server Error' })
        }
    } else {
        next();
    }
};