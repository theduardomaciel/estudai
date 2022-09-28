import type { NextPage } from 'next'

import Link from 'next/link';
import Head from 'next/head';

// Stylesheets
import styles from '../styles/Login.module.css'

// Icons
import Logo from "/public/logo.svg";
import GoogleLogo from "/public/google_logo.svg";

// Components
import Button from '../components/Button';
import { Separator } from '../components/Separator';
import Device from '../components/Landing/Device';

const Login: NextPage = () => {
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
                <Button
                    icon={<GoogleLogo />}
                    title={"Entrar com Google"}
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
                    }} />
                <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                <Link href={"/register"}>
                    <p className={styles.link}>Não tem uma conta? <span className="click bold">Criar uma conta</span></p>
                </Link>
            </div>
            <Device additionalClass={styles.device} />
        </main>
    )
}

export default Login;