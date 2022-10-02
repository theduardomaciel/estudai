import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
    const { 'nextauth.token': token } = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'http://localhost:3000/api'
    })

    api.interceptors.request.use(config => {
        /* console.log(config); */
        return config;
    })

    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return api;
}

export const api = getAPIClient()