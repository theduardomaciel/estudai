import { use } from 'next-api-route-middleware';

import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { allowMethods } from '../../../middlewares/allowMethods';
import { captureErrors } from '../../../middlewares/captureErrors';

import prisma from '../../../lib/prisma';
import getUser from '../../../services/getUser';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { id } = request.query;
    try {
        const user = getUser(parseInt(id as string))
        console.log(user, "🐶 Usuário obtido com sucesso!")
        response.status(200).json(user);
    } catch (error) {
        console.log(error)
        response.status(500)
    }
}

export default use(captureErrors, allowMethods(['GET']), handler);
