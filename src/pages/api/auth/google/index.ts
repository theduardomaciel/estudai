import { use } from 'next-api-route-middleware';
import jwt, { decode } from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import { allowMethods } from '../../../../middlewares/allowMethods';
import { captureErrors } from '../../../../middlewares/captureErrors';
import { oAuth2Client } from '../../../../lib/oAuth2Client';

// DB
import prisma from '../../../../lib/prisma';

// Types
import { RegisterProps } from '../../../../contexts/AuthContext';
import { setCookie } from 'nookies';

interface GoogleResponse {
    email: string,
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

function getAppAuthenticationToken(user_email: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    console.log(jwtSecretKey)
    const token = jwt.sign({ user_email }, jwtSecretKey);
    console.log("CRIOU", token)
    return token;
}

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { registerData, code } = request.body;
    const { tokens } = await oAuth2Client.getToken(code);

    console.log("Iniciando processo de autenticação.")

    const userInfo = decode(tokens.id_token as string) as GoogleResponse;
    try {
        // Checamos se o usuário com a conta Google obtida acima possui conta na plataforma
        let user = await prisma.user.findUnique({
            where: {
                email: userInfo.email
            },
            include: {
                account: true
            }
        });

        // Caso não possua conta e ele tenha acessado essa rota por meio de uma tela de login, retornamos para que o cliente saiba que precisa solicitar mais dados
        if (user === null && !registerData) {
            response.status(201).json({ error: "There is no register data, nor user associated with this Google account." })
        } else {
            // Caso possua, continuamos com a autenticação, primeiramente, com a criação do accessToken da aplicação
            let appToken = getAppAuthenticationToken(userInfo.email);

            // Separamos os tokens do Google
            const google_access_token = tokens.access_token as string;
            const google_refresh_token = tokens.refresh_token as string;

            if (user === null && registerData && registerData !== null) {
                const user = await prisma.user.create({
                    data: {
                        email: userInfo.email,
                        firstName: userInfo.given_name,
                        lastName: userInfo.family_name,
                        image_url: userInfo.picture,
                        course: registerData.course,
                        account: {
                            create: {
                                access_token: appToken,
                                google_access_token: google_access_token,
                                google_refresh_token: google_refresh_token,
                                google_expires_at: tokens.expiry_date,
                            }
                        }
                    }
                })

                console.log(user, "🏃‍♂️ Usuário criado com sucesso!")
                response.status(200).json({ appToken, google_access_token, google_refresh_token });
            } else {
                /* user = await prisma.user.update({
                    where: {
                        email: userInfo.email,
                    },
                    data: {
                        account: {
                            update: {
                                access_token: appToken,
                            }
                        }
                    }
                }) */

                // Usando o método acima, o usuário teria que re-logar toda vez que trocasse de dispositivo.
                // No futuro, criar sistema de refresh token

                appToken = user?.account?.access_token as string;

                console.log(user, "😊 Usuário obtido com sucesso!")
                response.status(200).json({ appToken, google_access_token, google_refresh_token });
            }
        }
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: error })
    }
}

export default use(captureErrors, allowMethods(['POST']), handler);
