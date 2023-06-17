import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";

import prisma from "../lib/prisma";

export const preload = () => {
	void getUser();
};

const getUser = cache(async (/* id: string */) => {
	const token = cookies().get("estudai.auth.token")?.value;

	if (!token) {
		console.log("❌ Não foi possível obter o token.");
		return null;
	}

	const decodePayload = decode(token) as { email: string };
	if (!decodePayload) return null;

	const taskInclude = {
		include: {
			subjects: true,
			interactions: {
				include: {
					user: true,
				},
			},
		},
	};

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: decodePayload.email,
			},
			include: {
				activities: taskInclude,
				tests: taskInclude,
				events: {
					include: {
						interactions: true,
					},
				},
			},
		});

		console.log("🙍‍♂️ Usuário obtido com sucesso!");
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
});

export default getUser;
