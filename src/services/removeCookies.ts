import { GetServerSidePropsContext, PreviewData } from "next"
import { useRouter } from "next/router"
import { destroyCookie } from "nookies"
import { ParsedUrlQuery } from "querystring"

export default async function removeCookies(context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    try {
        await destroyCookie(context, 'auth.googleAccessToken')
        await destroyCookie(context, 'auth.googleRefreshToken')
        await destroyCookie(context, 'auth.token')
    } catch (error) {
        console.log(error)
    }
}