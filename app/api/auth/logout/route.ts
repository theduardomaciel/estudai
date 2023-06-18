import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const PREFIX = searchParams.get("prefix") || "estudai.auth.";

	cookies().set({
		name: `${PREFIX}token`,
		value: "",
		maxAge: 0,
		path: "/",
	});

	cookies().set({
		name: `${PREFIX}google_access_token`,
		value: "",
		maxAge: 0,
		path: "/",
	});

	cookies().set({
		name: `${PREFIX}google_refresh_token`,
		value: "",
		maxAge: 0,
		path: "/",
	});

	redirect("/");
}
