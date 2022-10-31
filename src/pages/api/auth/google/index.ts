import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'

import jwt, { decode } from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

// Middlewares
import cors from "cors";

// DB
import prisma from '../../../../lib/prisma';

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

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(expressWrapper(cors()))
    .post(async (req, res) => {
        const { registerData, code } = req.body;

        const oAuth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_ID,
            process.env.GOOGLE_SECRET,
            process.env.NODE_ENV === "development" ? `http://localhost:3000/auth/${registerData ? 'register' : 'login'}` : `https://estudai.vercel.app/auth/${registerData ? 'register' : 'login'}`, // caso volte pro popup: "postmessage"
        );

        const { tokens } = await oAuth2Client.getToken(code);
        console.log(tokens)

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
                res.status(201).json({ error: "There is no register data, nor user associated with this Google account." })
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

                    const userId = user.id;

                    console.log(user, "🏃‍♂️ Usuário criado com sucesso!")
                    res.status(200).json({ userId, appToken, tokens });
                } else {
                    const user = await prisma.user.update({
                        where: {
                            email: userInfo.email,
                        },
                        data: {
                            account: {
                                update: {
                                    access_token: appToken,
                                    google_access_token: google_access_token,
                                    google_refresh_token: google_refresh_token,
                                    google_expires_at: tokens.expiry_date,
                                }
                            }
                        },
                        include: {
                            account: true
                        }
                    })

                    const userId = user.id;

                    console.log(user, "😊 Usuário obtido com sucesso!")
                    res.status(200).json({ userId, appToken, tokens });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error })
        }
    })

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});