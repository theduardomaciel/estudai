import { GetServerSidePropsContext, PreviewData } from "next"
import { destroyCookie } from "nookies"
import { ParsedUrlQuery } from "querystring"

export function eraseCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export default async function removeCookies(context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    try {
        if (context) {
            await destroyCookie(context, 'auth.googleAccessToken')
            await destroyCookie(context, 'auth.googleRefreshToken')
            await destroyCookie(context, 'estudai.token')
            await destroyCookie(context, 'estudai.userId')
            await destroyCookie(context, 'estudai.ignoreFocus')
        } else {
            eraseCookie('auth.googleAccessToken')
            eraseCookie('auth.googleRefreshToken')
            eraseCookie('estudai.token')
            eraseCookie('estudai.userId')
            eraseCookie('estudai.ignoreFocus')
        }
    } catch (error) {
        console.log(error)
    }
}