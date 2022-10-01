import { Middleware } from 'next-api-route-middleware';

export const captureErrors: Middleware = async (req, res, next) => {
    try {
        await next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error!' });
    }
};