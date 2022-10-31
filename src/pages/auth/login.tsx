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

interface Props {
    onClick?: () => void;
    loading?: boolean;
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token } = parseCookies(context)

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

export const GoogleButton = (props: any) => <Button
    icon={<GoogleLogo />}
    title={"Entrar com Google"}
    iconProps={{ color: 'var(--primary-02)' }}
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
        <h1>Eita!</h1>
        <p><strong>Parece que você não nos deu acesso ao Drive :(</strong> <br /> <br />
            Para poder logar ou criar uma conta é necessário permitir o acesso a todos os escopos solicitados para que você possa enviar anexos em suas tarefas.
        </p>
    </header>
    <Button
        style={{ padding: "1rem 1.5rem", width: "100%" }}
        title='Voltar ao início'
        onClick={setSection}
    />
    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
</div>

const Error = ({ setSection }: { setSection: () => void }) => <div className={styles.section}>
    <header>
        <h1>Eita!</h1>
        <p><strong>Parece que tivemos um problema interno no servidor :(</strong> <br /> <br />
            Provavelmente, já estamos trabalhando o mais rápido possível para resolver isso. Desde já agradecemos sua compreensão e espera!
        </p>
    </header>
    <Button
        style={{ padding: "1rem 1.5rem", width: "100%" }}
        title='Voltar ao início'
        onClick={setSection}
    />
    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
</div>

const Login: NextPage = () => {
    const { signIn } = useAuth();
    const router = useRouter();

    const [isLoading, setLoading] = useState(router.query.code !== undefined);
    const [section, setSection] = useState<string | null>(null)

    const googleLogin = useGoogleLogin({
        /* onSuccess: async ({ code }) => {
            const response = await signIn(code) // success | noAccount | scopeMissing

            if (response === 'success') {
                router.push(`/home`)
            } else {
                setSection(response)
            }
        }, */
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
                        </>
                        :
                        section === 'noAccount' ?
                            <div className={styles.section}>
                                <header>
                                    <h1>Eita!</h1>
                                    <p>Parece que você ainda não criou sua conta na plataforma. <br />
                                        Crie sua conta agora para aproveitar todas as funcionalidades de sua conta Estudaí.
                                    </p>
                                </header>
                                <Link href={"/auth/register"}>
                                    <Button
                                        style={{ padding: "1rem 1.5rem", width: "100%" }}
                                        title='Criar uma conta'
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
        </main>
    )
}

export default Login;