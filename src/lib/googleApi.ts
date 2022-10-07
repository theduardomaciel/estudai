import axios from "axios";
import { parseCookies } from "nookies";

export function getGoogleAPIClient(ctx?: any) {
    const { 'auth.googleAccessToken': accessToken, 'auth.googleRefreshToken': refreshToken } = parseCookies(ctx)

    console.log(accessToken)

    const api = axios.create({
        baseURL: 'https://www.googleapis.com/upload/drive/v3',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })

    api.interceptors.request.use(config => {
        /* console.log(config); */
        return config;
    })

    if (accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        console.log("Access Token: ", accessToken, api.defaults.headers.common['Authorization'])
    }

    return api;
}