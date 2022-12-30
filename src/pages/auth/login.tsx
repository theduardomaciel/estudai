import React, { useEffect, useRef, useState } from 'react';
import { parseCookies } from 'nookies';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

// Authentication
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';

import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Stylesheets
import styles from '../../styles/Login.module.css'

// Icons
import Logo from "/public/logo.svg";
import GoogleLogo from "/public/google_logo.svg";

// Components
import Button from '../../components/Button';
import { Separator } from '../../components/Separator';
import Device from '../../components/Landing/Device';
import Translate, { TranslateText } from '../../components/Translate';
import { NextPageWithTheme } from '..';

interface Props {
    onClick?: () => void;
    loading?: boolean;
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    return {
        props: {

        }
    }
}

export const GoogleButton = (props: any) => <Button
    icon={<GoogleLogo />}
    title={TranslateText("Sign in with Google")}
    iconProps={{ color: 'var(--primary-02)' }}
    coloredSpinner
    style={{
        padding: "1.2rem",
        gap: "3rem",
        backgroundColor: "var(--light)",
        border: "1px solid var(--light-gray)",
        color: "var(--font-light)",
        fontFamily: "Inter",
        width: "100%",
        fontWeight: 500,
        fontSize: "1.4rem",
        boxShadow: "0px 4px 15px 2px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.5rem",
    }}
    {...props}
/>

export const ScopeMissing = ({ setSection }: { setSection: () => void }) => <div className={styles.section}>
    <header>
        <h1><Translate>Jeez</Translate>!</h1>
        <p><strong><Translate>Looks like you didn't give us Drive access.</Translate> :(</strong> <br /> <br />
            <Translate>To be able to log in or create an account it is necessary to allow access to all requested scopes so that you can send attachments in your tasks.</Translate>
        </p>
    </header>
    <Button
        style={{ padding: "1rem 1.5rem", width: "100%" }}
        title={TranslateText("Back to home")}
        onClick={setSection}
    />
    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
</div>

const Error = ({ setSection }: { setSection: () => void }) => <div className={styles.section}>
    <header>
        <h1><Translate>Jeez</Translate>!</h1>
        <p><strong><Translate>It looks like we had an internal server problem.</Translate> :(</strong> <br /> <br />
            <Translate>We are probably already working as quickly as possible to resolve this. Thank you in advance for your understanding and waiting!</Translate>
        </p>
    </header>
    <Button
        style={{ padding: "1rem 1.5rem", width: "100%" }}
        title={TranslateText("Back to home")}
        onClick={setSection}
    />
    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
</div>

const Login: NextPageWithTheme = () => {
    const { signIn } = useAuth();
    const router = useRouter();

    const [isLoading, setLoading] = useState(router.query.code !== undefined);
    const [section, setSection] = useState<string | null>(null)

    const googleLogin = useGoogleLogin({
        onError(errorResponse) {
            console.log(errorResponse)
            setLoading(false)
        },
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
        flow: 'auth-code',
        ux_mode: "redirect",
        redirect_uri: process.env.NEXT_PUBLIC_NODE_ENV === "development" ? `http://localhost:3000/auth/login` : `https://estudai.vercel.app/auth/login`
    });

    const hasLoggedRef = useRef(false);

    async function loginUser() {
        if (router.query.code && hasLoggedRef.current === false) {
            console.log("Logando")
            hasLoggedRef.current = true
            const response = await signIn(router.query.code as string) // success | noAccount | scopeMissing

            if (response === 'success') {
                router.push(`/home`)
            } else {
                setSection(response)
            }
        }
    }

    useEffect(() => {
        loginUser()
    }, [])

    return (
        <main className={styles.holder}>
            <Head>
                <title>Login</title>
            </Head>
            <div className={`${styles.container} ${section !== null ? styles.fullScreen : ""}`}>
                <Logo width={121.19} height={58.72} fill={`var(--primary-02)`} />
                {
                    section === null ?
                        <>
                            <header>
                                <h1>Log in</h1>
                                <p><Translate>Login with your account to enjoy all the features of the platform</Translate>.</p>
                            </header>
                            <GoogleButton
                                isLoading={isLoading}
                                onClick={() => {
                                    googleLogin()
                                    setLoading(true)
                                }} />
                            <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                            <Link href={"/auth/register"}>
                                <p className={styles.link}><Translate>Don't have an account?</Translate> <span className="click bold"><Translate>Create an account</Translate></span></p>
                            </Link>
                        </>
                        :
                        section === 'noAccount' ?
                            <div className={styles.section}>
                                <header>
                                    <h1><Translate>Jeez</Translate>!</h1>
                                    <p><Translate>It looks like you haven't created your account on the platform yet.</Translate> <br />
                                        <Translate>Create your account now to enjoy all the features of your Estudaí account.</Translate>
                                    </p>
                                </header>
                                <Link href={"/auth/register"} style={{ width: "100%" }}>
                                    <Button
                                        style={{ padding: "1rem 1.5rem", width: "100%" }}
                                        title={TranslateText("Create an account")}
                                    />
                                </Link>
                                <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                            </div>
                            :
                            section === "scopeMissing" ?
                                <ScopeMissing setSection={() => {
                                    setSection(null)
                                    setLoading(false)
                                }} />
                                :
                                <Error setSection={() => {
                                    setSection(null)
                                    setLoading(false)
                                }} />
                }
            </div>
            <Device additionalClass={styles.device} />
            {/* {
                !router.query.code && <EarlyAccessModalPreset />
            } */}
        </main>
    )
}

Login.theme = "default";
export default Login;