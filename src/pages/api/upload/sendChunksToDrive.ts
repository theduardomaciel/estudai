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

// start = starting index of the chunk | end = end index of the chunk
// length = length of the entire file | sessionUrl = google resumable session URL

// File upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadMiddleware = upload.single('blob');

/* 
[Object: null prototype] {
  start: '0',
  end: '2621440',
  sessionUrl: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=ADPycdsDnV1aP9BWWooLR5c6nH8M6Se6mfogYavkDdDfjirJU1nmTbNUjzmbQCSVmK911nGKijEi1xb2weKCeGpgCZrvaw',
  length: '22478171'
}
{
  fieldname: 'blob',
  originalname: 'blob',
  encoding: '7bit',
  mimetype: 'application/octet-stream',
  buffer: <Buffer 25 50 44 46 2d 31 2e 34 0d 25 e2 e3 cf d3 0d 0a 31 37 32 39 20 30 20 6f 62 6a 0d 3c 3c 2f 4c 69 6e 65 61 72 69 7a 65 64 20 31 2f 4c 20 32 32 34 37 38 ... 2621390 more bytes>,
  size: 2621440
} 
*/

router
    //.use(isAuthenticated)
    .use(expressWrapper(cors()))
    .use(expressWrapper(uploadMiddleware) as any) // express middleware are supported if you wrap it with expressWrapper
    .post(async (req, res) => {
        const { start, end, sessionUrl, length } = req.body;
        const token = req.cookies['auth.googleAccessToken'];

        const headers = {
            'Content-Length': req.file.size,
            'Content-Range': `bytes ${start}-${end - 1}/${length}`,
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await axios.put(sessionUrl, req.file.buffer, { headers: headers })
            console.log(response.data, "Dados retornados.")

            res.status(201).json(response.data)
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
                    res.status(500).json({ error: "the upload session has expired and the upload must be restarted from the beginning." })
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
