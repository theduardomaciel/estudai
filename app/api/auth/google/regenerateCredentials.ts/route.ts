import { NextRequest, NextResponse } from "next/server";

import { UserRefreshClient } from "google-auth-library";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { refreshToken } = body as {
			refreshToken: string;
		};
		if (refreshToken) {
			const user = new UserRefreshClient(
				process.env.NEXT_PUBLIC_GOOGLE_ID,
				process.env.GOOGLE_SECRET,
				refreshToken as string
			);

			const { credentials } = await user.refreshAccessToken(); // obtain new tokens

			return NextResponse.json({ credentials }, { status: 200 });
		} else {
			return NextResponse.json(
				{ error: "No valid refresh token was provided." },
				{ status: 400 }
			);
		}
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: error.response.data },
			{ status: 400 }
		);
	}
}
