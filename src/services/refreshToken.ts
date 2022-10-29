import { NextApiResponse } from "next";
import { UserRefreshClient } from "google-auth-library";

import { setCookie } from "nookies";

// DB
import prisma from '../lib/prisma';

export default async function refreshToken(res: NextApiResponse<any>, userId: number, googleRefreshToken: string) {
    console.log("O token de acesso ao Google do usuário expirou, obtendo um novo...")

    try {
        const user = new UserRefreshClient(process.env.NEXT_PUBLIC_GOOGLE_ID, process.env.GOOGLE_SECRET, googleRefreshToken);
        const { credentials } = await user.refreshAccessToken(); // obtain new tokens

        if (credentials) {
            console.log(`Novas credenciais obtidas com sucesso. Aplicando-as...`)

            // Atualizamos o token Google na conta do usuário
            await prisma.account.update({
                where: {
                    userId: userId
                },
                data: {
                    google_access_token: credentials.access_token,
                    google_refresh_token: credentials.refresh_token,
                    expires_at: credentials.expiry_date
                }
            })

            console.log(credentials.access_token, "Novo access_token do Google obtido com sucesso.")

            setCookie({ res }, 'auth.googleAccessToken', credentials.access_token as string, {
                maxAge: 60 * 60 * 24 * 30 * 12 * 180,
            })

            return credentials.access_token as string;
        } else {
            console.log(`Google refresh token expired.`)
            return null
        }
    } catch (error: any) {
        console.log(error)
        return null
    }
}