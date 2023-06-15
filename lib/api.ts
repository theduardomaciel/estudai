import axios from "axios";

export function getAPIClient() {
	const api = axios.create({
		baseURL: "/api",
	});

	api.interceptors.request.use((config) => {
		/* console.log(config); */
		return config;
	});

	return api;
}

export const api = getAPIClient();
