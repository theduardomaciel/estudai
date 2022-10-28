import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any, preToken?: string) {
    const { 'auth.token': token } = parseCookies(ctx)

    const api = axios.create({
        baseURL: '/api'
    })

    api.interceptors.request.use(config => {
        /* console.log(config); */
        return config;
    })

    if (preToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${preToken}`;
    } else if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return api;
}

export const api = getAPIClient()