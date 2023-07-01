import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import jwt, { decode } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// Utils
import prisma from "@/lib/prisma";
import { Course } from "@prisma/client";
import type { RegisterProps } from "@/lib/auth";

interface GoogleResponse {
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

function getAppAuthenticationToken(user_email: string, user_id: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    const token = jwt.sign(
        { email: user_email, userId: user_id },
        jwtSecretKey
    );
    return token;
}

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
    const body = await request.json();
    const { registerData, code, PREFIX } = body as {
        registerData: RegisterProps;
        code: string;
        PREFIX: string;
    };

    if (!PREFIX) {
        return new Response("Prefix not provided.", { status: 400 });
    }

    const oAuth2Client = new OAuth2Client(
        process.env.NEXT_PUBLIC_GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        process.env.NODE_ENV === "development"
            ? `http://localhost:3000/${registerData ? "register" : "login"}`
            : `https://estudai.vercel.app/${
                  registerData ? "register" : "login"
              }` // caso volte pro popup: "postmessage"
    );

    console.log("Iniciando processo de autenticação.");

    const { tokens } = await oAuth2Client.getToken(code);
    const userInfo = decode(tokens.id_token as string) as GoogleResponse;

    try {
        // Checamos se o usuário com a conta Google obtida acima possui conta na plataforma
        const checkUser = await prisma.user.findUnique({
            where: {
                email: userInfo.email,
            },
        });

        console.log(checkUser);

        // Caso não possua conta e ele tenha acessado essa rota por meio de uma tela de login, retornamos para que o cliente saiba que precisa solicitar mais dados
        if (!checkUser && !registerData) {
            console.log("🚫 Usuário não encontrado.");
            return NextResponse.json(
                { message: "Usuário não encontrado." },
                { status: 404 }
            );
        } else {
            // Separamos os tokens do Google
            const google_access_token = tokens.access_token as string;
            const google_refresh_token = tokens.refresh_token as string;

            if (!checkUser && registerData) {
                if (
                    !Object.values(Course).includes(
                        registerData.course as keyof typeof Course
                    )
                ) {
                    return new Response("Invalid course.", { status: 400 });
                }

                const newUser = await prisma.user.create({
                    data: {
                        firstName: userInfo.given_name,
                        lastName: userInfo.family_name,
                        email: userInfo.email,
                        image_url: userInfo.picture,
                        course: registerData.course as keyof typeof Course,
                    },
                });

                const appToken = getAppAuthenticationToken(
                    userInfo.email,
                    newUser.id
                );
                console.log("🔑 Token da aplicação criado com sucesso.");

                cookies().set(`${PREFIX}token`, appToken);
                cookies().set(
                    `${PREFIX}google_access_token`,
                    google_access_token
                );
                cookies().set(
                    `${PREFIX}google_refresh_token`,
                    google_refresh_token
                );

                console.log(newUser, "🏃‍♂️ Usuário criado com sucesso!");
                return NextResponse.json(
                    { message: "Usuário criado com sucesso.", tokens: tokens },
                    { status: 201 }
                );
            } else {
                const appToken = getAppAuthenticationToken(
                    userInfo.email,
                    checkUser!.id
                );
                console.log("🔑 Token da aplicação criado com sucesso.");

                cookies().set(`${PREFIX}token`, appToken);
                cookies().set(
                    `${PREFIX}google_access_token`,
                    google_access_token
                );
                cookies().set(
                    `${PREFIX}google_refresh_token`,
                    google_refresh_token
                );

                console.log(checkUser, "😊 Usuário obtido com sucesso!");
                return NextResponse.json(
                    { message: "Usuário obtido com sucesso.", tokens: tokens },
                    { status: 200 }
                );
            }
        }
    } catch (error) {
        console.log(error);
        return new Response(error as unknown as any, { status: 500 });
    }
}
