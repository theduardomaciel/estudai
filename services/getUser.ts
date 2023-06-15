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

	const interactedByInclude = {
		include: {
			interactedBy: true,
		},
	};

	const subjectsInclude = {
		include: {
			subjects: true,
			interactedBy: true,
		},
	};

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: decodePayload.email,
			},
			include: {
				groups: {
					include: {
						activities: interactedByInclude,
						tests: interactedByInclude,
						events: interactedByInclude,
					},
				},
				activities: subjectsInclude,
				activitiesInteracted: subjectsInclude,
				tests: subjectsInclude,
				testsInteracted: subjectsInclude,
				events: true,
				eventsInteracted: true,
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
