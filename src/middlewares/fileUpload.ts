import multer from 'multer';
import { NextApiRequest } from 'next';
import { Middleware } from 'next-api-route-middleware';

// File upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

type NextApiRequestWithBodyData = NextApiRequest & { files: any };

export const fileUpload: Middleware<NextApiRequestWithBodyData> = async (req, res, next) => {
    try {
        // Returns middleware that processes multiple files sharing the same field name.
        const uploadMiddleware = upload.array('theFiles');
        console.log(uploadMiddleware, 'ARQUIVOS')
        req.files = uploadMiddleware;
        await next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error!' });
    }
};