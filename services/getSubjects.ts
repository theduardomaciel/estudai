import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

import prisma from "../lib/prisma";
import type { Subject } from "@prisma/client";

export const preload = () => {
    void getSubjects();
};

const getSubjects = cache(async (includeUser?: boolean) => {
    console.log("📚 Obtendo matérias...");
    if (includeUser) {
        const token = cookies().get("estudai.auth.token")?.value;

        if (!token) {
            console.log("❌ Não foi possível obter o token.");
            return null;
        }

        const decodePayload = decode(token) as { userId: string };
        if (!decodePayload.userId) return null;

        try {
            return await prisma.subject.findMany({
                where: {
                    userId: decodePayload.userId,
                },
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    } else {
        try {
            /* const cacheSubjects = cookies().get(
                "estudai.default.subjects"
            )?.value;

            if (cacheSubjects) {
                return JSON.parse(cacheSubjects) as Subject[];
            }

            const defaultSubjects = await prisma.subject.findMany({
                where: {
                    userId: null,
                },
            });

            if (!cacheSubjects) {
                cookies().set(
                    "estudai.default.subjects",
                    JSON.stringify(defaultSubjects),
                    {
                        expires: new Date(
                            Date.now() + 1000 * 60 * 60 * 24 * 30
                        ),
                        path: "/",
                    }
                );
            }

            return defaultSubjects; */
            return await prisma.subject.findMany({
                where: {
                    userId: null,
                },
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    }
});

export default getSubjects;
