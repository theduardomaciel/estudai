import React, { useState } from 'react';
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

interface Props {
    onClick?: () => void;
    loading?: boolean;
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['nextauth.token']: token } = parseCookies(context)

    if (token) {
        return {
            redirect: {
                destination: "/home",
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}

export const GoogleButton = React.forwardRef((props: any, ref) => <Button
    ref={ref}
    icon={<GoogleLogo />}
    title={"Entrar com Google"}
    iconColor={'var(--primary-02)'}
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
/>)

const Login: NextPage = () => {
    const { signIn } = useAuth();
    const [isLoading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            signIn(code)
        },
        onError(errorResponse) {
            console.log(errorResponse)
            setLoading(false)
        },
        scope: "https://www.googleapis.com/auth/drive", //https://www.googleapis.com/auth/drive.file
        flow: 'auth-code',
        /* ux_mode: "redirect",
        redirect_uri: "http://localhost:3000/auth/login" */
    });

    return (
        <main className={styles.holder}>
            <Head>
                <title>Login</title>
            </Head>
            <div className={styles.container}>
                <Logo width={121.19} height={58.72} />
                <header>
                    <h1>Log in</h1>
                    <p>Entre com sua conta para desfrutar de todas as funcionalidades da plataforma.</p>
                </header>
                <GoogleButton
                    isLoading={isLoading}
                    onClick={() => {
                        googleLogin()
                        setLoading(true)
                    }} />
                <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                <Link href={"/auth/register"}>
                    <p className={styles.link}>Não tem uma conta? <span className="click bold">Criar uma conta</span></p>
                </Link>
            </div>
            <Device additionalClass={styles.device} />
        </main>
    )
}

export default Login;