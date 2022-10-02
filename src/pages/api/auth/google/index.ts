import { use } from 'next-api-route-middleware';
import jwt, { decode } from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { allowMethods } from '../../../../middlewares/allowMethods';
import { captureErrors } from '../../../../middlewares/captureErrors';
import { oAuth2Client } from '../../../../lib/oAuth2Client';
import prisma from '../../../../lib/prisma';

import { User } from '../../../../types/User';

interface GoogleResponse {
    email: string,
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const isRegisterProcess = request.body.isRegisterProcess;
    const { tokens } = await oAuth2Client.getToken(request.body.code)

    console.log("Iniciando processo de autenticação.")

    function getAppAuthenticationToken(user_email: string) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

        if (jwtSecretKey) {
            return jwt.sign({ user_email }, jwtSecretKey);
        } else {
            return null;
        }
    }

    try {
        const userInfo = decode(tokens.id_token as string) as GoogleResponse;

        let user = await prisma.user.findUnique({
            where: {
                email: userInfo.email
            }
        })

        if (user === null && isRegisterProcess === false) {
            response.status(201).json({ error: "Incorrect route accessed." })
            return;
        }

        const token = getAppAuthenticationToken(userInfo.email);

        const google_access_token = tokens.access_token as string;
        const google_refresh_token = tokens.refresh_token as string;

        let authenticationType = 'login';

        if (user === null) {
            authenticationType = 'register';

            user = await prisma.user.create({
                data: {
                    email: userInfo.email,
                    firstName: userInfo.given_name,
                    lastName: userInfo.family_name,
                    image_url: userInfo.picture,
                    account: {
                        create: {
                            refresh_token: google_refresh_token,
                            access_token: google_access_token,
                            expires_at: tokens.expiry_date,
                            id_token: tokens.id_token
                        }
                    }
                }
            })
            console.log(user, "😊 Usuário criado com sucesso!")
            response.status(200).json({ authenticationType, user, token, google_access_token, google_refresh_token });
        } else {
            console.log(user, "😊 Usuário logado com sucesso!")
            response.status(200).json({ authenticationType, user, token, google_access_token, google_refresh_token });
        }
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: error })
    }
}

export default use(captureErrors, allowMethods(['POST']), handler);
