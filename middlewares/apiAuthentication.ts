import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

// Types
import { User } from "@prisma/client";

export type NextApiRequestWithUser = NextApiRequest & User;

export const isAuthenticated = async (
	req: NextApiRequest,
	res: NextApiResponse,
	next: any
) => {
	const { token } = req.query;

	if (token) {
		/* req.userId = authCookie.userId; */
		if (!process.env.JWT_SECRET_KEY) {
			res.status(501).send({ message: "Internal server key error." });
		}
		const verified = verify(
			token as string,
			process.env.JWT_SECRET_KEY as string
		);
		if (verified) {
			console.log("O usuário está autenticado.");
			return await next();
		} else {
			res.status(401).send({
				message: "The token in storage is expired.",
			});
			/* return {
                props: { error: e.message },
            }; */
		}
	} else {
		res.status(401).send({ message: "There is no token in storage." });
	}
};
