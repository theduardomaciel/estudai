import axios from "axios";
import { parseCookies } from "nookies";

export function getGoogleAPIClient(ctx?: any) {
    const { 'auth.googleAccessToken': accessToken, 'auth.googleRefreshToken': refreshToken } = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'https://www.googleapis.com/upload/drive/v3'
    })

    api.interceptors.request.use(config => {
        console.log(config);
        return config;
    })

    if (accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    return api;
}

export const googleApi = getGoogleAPIClient()