import { use } from 'next-api-route-middleware';
import type { NextApiRequest, NextApiResponse } from 'next'

import { UserRefreshClient } from "google-auth-library";

// Middlewares
import { allowMethods } from '../../../../middlewares/allowMethods';
import { captureErrors } from '../../../../middlewares/captureErrors';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const user = new UserRefreshClient(
        process.env.NEXT_PUBLIC_GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        request.body.refreshToken,
    );
    const { credentials } = await user.refreshAccessToken(); // obtain new tokens
    response.json(credentials);
}

export default use(captureErrors, allowMethods(['POST']), handler);