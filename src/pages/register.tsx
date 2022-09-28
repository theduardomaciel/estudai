import { useEffect, useState } from 'react';
import type { NextPage } from 'next'

import Link from 'next/link';
import Head from 'next/head';

// Stylesheets
import loginStyles from '../styles/Login.module.css';
import styles from "../styles/Register.module.css";

// Icons
import Logo from "/public/logo.svg";
import HoodIcon from "/public/icons/hood.svg";

// Components
import Button from '../components/Button';
import { Separator } from '../components/Separator';
import Device from '../components/Landing/Device';

const Landing: NextPage = () => {
    const [selected, setSelected] = useState<number | null>(null)

    const unselectedStyle = {
        padding: "2rem 2.5rem",
        gap: "2.5rem",
        justifyContent: "flex-start",
        backgroundColor: "var(--light)",
        border: "2px solid var(--primary-03)",
        color: "var(--primary-02)",
        width: "100%",
        borderRadius: "1rem",
    }

    const selectedStyle = {
        padding: "2rem 2.5rem",
        gap: "2.5rem",
        justifyContent: "flex-start",
        backgroundColor: "var(--primary-02)",
        border: "2px solid var(--primary-03)",
        color: "var(--light)",
        width: "100%",
        borderRadius: "1rem",
    }

    /* let progressValue = 0;
    const progressEndValue = 100;
    const speed = 50;

    const runTimer = (timer: any) => {
        console.log(timer)
        if (timer) {
            const progress = setInterval(() => {
                progressValue++;
                timer.style.background = `conic-gradient(
                    #4d5bf9 ${progressValue * 3.6}deg,
                    #cadcff ${progressValue * 3.6}deg
            )`
                console.log(timer.style.background)
                if (progressValue === progressEndValue) {
                    clearInterval(progress)
                    progressValue = 0;
                    console.log("Acabou.")
                }
            }, speed)
        }
    } */

    useEffect(() => {

    }, [selected])

    const TimerIcon = () => <div className={styles.timer}>
        <span className={`material-symbols-rounded filled`}>check_circle</span>
    </div>

    return (
        <main className={loginStyles.holder}>
            <Head>
                <title>Criar uma conta</title>
            </Head>
            <div className={loginStyles.container} style={{ gap: "3.5rem" }}>
                <Logo width={121.19} height={58.72} style={{ minHeight: 58 }} />
                <header style={{ alignItems: "center", "textAlign": "center" }}>
                    <h1>Organize seus estudos.</h1>
                    <p>Escolha em que tipo de curso você se encaixa para que possamos preparar a plataforma para você.</p>
                </header>
                <div className={styles.cardsHolder}>
                    <Button
                        icon={'backpack'}
                        iconFill={1}
                        iconSize={"4.2rem"}
                        style={selected === 0 ? selectedStyle : unselectedStyle}
                        onClick={(event) => setSelected(0)}
                    >
                        <div className={styles.buttonInfo} >
                            <h6>Estou cursando o ensino fundamental</h6>
                            <p>Preciso de ajuda para revisar assuntos base</p>
                        </div>
                        {
                            selected === 0 &&
                            <TimerIcon />
                        }
                    </Button>
                    <Button
                        icon={'book'}
                        iconFill={1}
                        iconSize={"4.2rem"}
                        style={selected === 1 ? selectedStyle : unselectedStyle}
                        onClick={(event) => setSelected(1)}
                    >
                        <div className={styles.buttonInfo} >
                            <h6>Estou cursando o ensino médio</h6>
                            <p>Preciso de ajuda para organizar horários e ter sanidade mental </p>
                        </div>
                        {
                            selected === 1 &&
                            <TimerIcon />
                        }
                    </Button>
                    <Button
                        icon={<HoodIcon className={`${styles.icon} ${selected === 2 ? styles.selected : ""}`} />}
                        iconFill={1}
                        iconSize={"4.2rem"}
                        style={selected === 2 ? selectedStyle : unselectedStyle}
                        onClick={(event) => setSelected(2)}
                    >
                        <div className={styles.buttonInfo}>
                            <h6>Estou cursando o ensino superior</h6>
                            <p>Preciso de ajuda para organizar horários e ter sanidade mental sem recorrer às drogas e/ou outros métodos ilícitos</p>
                        </div>
                        {
                            selected === 2 &&
                            <TimerIcon />
                        }
                    </Button>
                    <p className={styles.outro}>Não possuo filiação a nenhuma instituição de ensino</p>
                </div>
                <div className={'row'} style={{ justifyContent: "center", gap: "1rem" }}>
                    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                    <Separator style={{ backgroundColor: "var(--primary-02)", width: "10rem" }} orientation='horizontal' />
                </div>
                <Link href={"/login"}>
                    <p className={loginStyles.link}>Já tem uma conta? <span className="click bold">Log in</span></p>
                </Link>
            </div>
            <Device additionalClass={loginStyles.device} />
        </main>
    )
}

export default Landing;