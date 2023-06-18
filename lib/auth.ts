"use client";

import { hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { api } from "./api";

export const PREFIX = `estudai.auth.`;

export interface RegisterProps {
	course: string | null;
}

export async function signIn(code: string, registerData?: RegisterProps) {
	try {
		console.log(registerData);
		const response = await api.post("/auth/google", {
			registerData,
			code,
			PREFIX,
		});
		console.log(response);

		const { tokens, appToken } = response.data;

		const hasAccess = hasGrantedAllScopesGoogle(
			tokens,
			"https://www.googleapis.com/auth/drive.file",
			"https://www.googleapis.com/auth/drive.appdata"
		);
		console.log("Garantiu todo os escopos? ", hasAccess);

		if (response.status === 201) {
			if (hasAccess) {
				console.log(
					"Atualizando cookies com os tokens de autenticação.",
					appToken
				);

				api.defaults.headers.common[
					"Authorization"
				] = `Bearer ${appToken}`;

				return "success_created";
			} else {
				return "scopeMissing";
			}
		} else {
			if (hasAccess) {
				console.log(
					"Atualizando cookies com os tokens de autenticação.",
					appToken
				);

				api.defaults.headers.common[
					"Authorization"
				] = `Bearer ${appToken}`;

				return "success";
			} else {
				return "scopeMissing";
			}
		}
	} catch (error: any) {
		console.log(error);

		if (error.response.status === 404) {
			console.log("O usuário tentou logar, mas não possui conta.");
			return "noAccount";
		} else {
			return "serverError";
		}
	}
}

export async function signOut() {
	console.log("Des-logando usuário e retornando para página inicial.");
	try {
		const response = await api.post(`/auth/logout?prefix=${PREFIX}`);
		console.log(response);
		return true;
	} catch (error: any) {
		console.log(error);
	}
}
