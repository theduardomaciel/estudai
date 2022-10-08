import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { isAuthenticated } from '../../../middlewares/apiAuthentication';
import multer from 'multer';
import cors from "cors";

// API
import axios, { AxiosError } from 'axios';

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

// File upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadMiddleware = upload.single('blob');

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .use(expressWrapper(uploadMiddleware) as any) // express middleware are supported if you wrap it with expressWrapper
    .post(async (req, res) => {
        const { start, end, sessionUrl, length } = req.body; // start = starting index of the chunk | end = end index of the chunk | length = length of the entire file | sessionUrl = google resumable session URL
        const token = req.cookies['auth.googleAccessToken'];

        const headers = {
            'Content-Length': req.file.size,
            'Content-Range': `bytes ${start}-${end - 1}/${length}`,
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await axios.put(sessionUrl, req.file.buffer, { headers: headers })
            console.log(response.data, "Dados retornados.")

            try {
                const createPermission = await axios.post(`https://www.googleapis.com/drive/v3/files/${response.data.id}/permissions`, {
                    role: "commenter",
                    type: "anyone"
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (createPermission.data) {
                    const fileLink = await axios.get(`https://www.googleapis.com/drive/v3/files/${response.data.id}?fields=webContentLink,webViewLink`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    console.log(fileLink.data)
                    res.status(201).json({ id: response.data.id, downloadLink: fileLink.data.webContentLink, viewLink: fileLink.data.webViewLink })
                }
            } catch (error: any) {
                console.log(error.response.statusCode)
                res.status(201).json(response.data)
            }
        } catch (err: any) {
            const error = err as AxiosError;
            if (error.response) {
                if (error.response.status === 308) {
                    console.log(req.socket.bytesWritten)
                    const range = error.response.headers?.range
                    if (range) {
                        console.log('Chunk enviado com sucesso. Aguardando o envio dos outros.')
                        res.status(200).json({ success: "Chunk successfully processed. Waiting for the others upload." });
                    } else {
                        res.status(500).json({ error: "The chunk wasn't split correctly" });
                    }
                } else if (error.response.status === 404) {
                    res.status(500).json({ error: "The upload session has expired and the upload must be restarted from the beginning." })
                }
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
