import { use } from 'next-api-route-middleware';

import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { allowMethods } from '../../../middlewares/allowMethods';
import { captureErrors } from '../../../middlewares/captureErrors';

import prisma from '../../../lib/prisma';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { id } = request.query;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id as string,
            }
        })
        response.status(200).json(user);
    } catch (error) {
        console.log(error)
        response.status(500)
    }
}

export default use(captureErrors, allowMethods(['GET']), handler);
