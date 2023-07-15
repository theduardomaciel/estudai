import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

import prisma from "../lib/prisma";

export const preload = () => {
    void getSubjects();
};

const getSubjects = cache(async () => {
    console.log("📚 Obtendo matérias...");
    const token = cookies().get("estudai.auth.token")?.value;

    if (!token) {
        console.log("❌ Não foi possível obter o token.");
        return null;
    }

    const decodePayload = decode(token) as { userId: string };
    //console.log("🔑 Token decodificado:", decodePayload);

    try {
        return await prisma.subject.findMany({
            where: {
                OR: [
                    {
                        userId: decodePayload.userId,
                    },
                    {
                        userId: null,
                    },
                ],
            },
        });
    } catch (error) {
        console.log(error);
        return null;
    }
});

export default getSubjects;
