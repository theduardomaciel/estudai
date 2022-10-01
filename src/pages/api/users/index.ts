import { use } from 'next-api-route-middleware';

import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { allowMethods } from '../../../middlewares/allowMethods';
import { captureErrors } from '../../../middlewares/captureErrors';

import prisma from '../../../lib/prisma';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const users = await prisma.user.findMany({})

        if (users) {
            response.status(200).json(users);
        }
    } catch (error) {
        console.log(error)
        response.status(500)
    }
}

export default use(captureErrors, allowMethods(['POST']), handler);
