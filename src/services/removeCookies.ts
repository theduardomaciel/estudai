import { GetServerSidePropsContext, PreviewData } from "next"
import { destroyCookie } from "nookies"
import { ParsedUrlQuery } from "querystring"

export default async function removeCookies(context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    destroyCookie(context, 'auth.googleAccessToken')
    destroyCookie(context, 'auth.googleRefreshToken')
    destroyCookie(context, 'auth.token')
}