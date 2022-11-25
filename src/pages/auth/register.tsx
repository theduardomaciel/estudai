import { useEffect, useRef, useState } from 'react';
import { parseCookies } from 'nookies';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

import { motion, AnimatePresence } from "framer-motion"

import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Stylesheets
import loginStyles from '../../styles/Login.module.css';
import styles from "../../styles/Register.module.css";

// Icons
import Logo from "/public/logo.svg";
import HoodIcon from "/public/icons/hood.svg";

// Components
import Button from '../../components/Button';
import { Separator } from '../../components/Separator';
import Device from '../../components/Landing/Device';

// Authentication
import { GoogleButton, ScopeMissing } from './login';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import EarlyAccessModalPreset from '../../components/Modal/Presets/EarlyAccessModal';

interface TimerProps {
    current?: boolean;
}

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

const separator = {
    backgroundColor: "var(--primary-02)", width: "35%", height: 1
}

const TimerIcon = (props: TimerProps) => <div className={`${styles.timer} `}>
    <span className={`material-symbols-rounded filled`}>check_circle</span>
</div>

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    }
};

const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
}

const INTERVAL_TIME = 4;

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

const Register: NextPage = () => {
    const router = useRouter();
    const { registered } = router.query;

    const { signIn } = useAuth();
    const [isLoading, setLoading] = useState(router.query.code !== undefined);

    const [[section, direction], setSection] = useState(registered ? [3, 1] : router.query.code ? [3, 1] : [1, 0]);
    const [selected, setSelected] = useState<null | number>(null);

    const progressBar = useRef<HTMLDivElement>(null);

    const [currentTimeout, setCurrentTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
    const changeSection = (newSection: number) => {
        // Removemos a animação da barra de progresso
        if (progressBar.current) {
            console.log("Reiniciando a animação")
            progressBar.current.classList.remove(styles.animate)
        }

        console.log("Limpando timeout")
        clearTimeout(currentTimeout as ReturnType<typeof setTimeout>)
        setCurrentTimeout(null)

        // Caso o usuário selecione novamente a mesma opção, cancelamos a seleção
        if (newSection === selected) {
            setSelected(null)
        } else {
            // Alteramos a seção selecionada pelo usuário
            setSelected(newSection)
            console.log(newSection)
            if (newSection) {
                window.sessionStorage.setItem("course", newSection.toString() as string)
            }

            setTimeout(() => {
                // Iniciamos a animação da barra de progresso
                if (progressBar.current) {
                    console.log("Animando barra para o 100%")
                    progressBar.current.classList.toggle(styles.animate)
                }
            }, 250);

            const timeout = setTimeout(() => {
                console.log("timeout", currentTimeout)
                /* if (currentTimeout !== null && selected !== null && selected === newSection) { */
                console.log(`Avançando seção com a opção ${selected} selecionada.`)

                // Progredimos para a próxima seção
                setSection([2, 1])

                // Removemos a animação da barra de progresso
                if (progressBar.current) {
                    progressBar.current.classList.toggle(styles.animate)
                }
                clearTimeout(currentTimeout as ReturnType<typeof setTimeout>)
                setCurrentTimeout(null)
                /* } */
            }, INTERVAL_TIME * 1000);

            setCurrentTimeout(timeout)
        }
    }

    function returnToSection1() {
        // Reiniciamos o valor do state
        setSelected(null)

        // Removemos o estado de carregamento
        setLoading(false)

        // Voltamos
        setSection([1, -1])
    }

    /*  */

    const Section1 = <motion.div
        className={styles.section}
        key={section}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
    >
        <header style={{ alignItems: "center", "textAlign": "center" }}>
            <h1>Organize seus estudos.</h1>
            <p>Escolha em que tipo de curso você se encaixa para que possamos preparar a plataforma para você.</p>
        </header>
        <div className={styles.cardsHolder}>
            <Button
                icon={'backpack'}
                iconProps={{ size: "4.2rem", filled: true }}
                classes={selected === 0 ? styles.current : ""}
                style={selected === 0 ? selectedStyle : unselectedStyle}
                onClick={(event) => changeSection(0)}
            >
                <div className={styles.buttonInfo} >
                    <h6>Estou cursando o ensino fundamental</h6>
                    <p>Preciso de ajuda para revisar assuntos base</p>
                </div>
                {
                    selected === 0 &&
                    <TimerIcon current={selected === 0 ? true : false} />
                }
            </Button>
            <Button
                icon={'book'}
                iconProps={{ size: "4.2rem", filled: true }}
                classes={selected === 1 ? styles.current : ""}
                style={selected === 1 ? selectedStyle : unselectedStyle}
                onClick={(event) => changeSection(1)}
            >
                <div className={styles.buttonInfo}>
                    <h6>Estou cursando o ensino médio</h6>
                    <p>Preciso de ajuda para organizar horários e ter sanidade mental </p>
                </div>
                {
                    selected === 1 &&
                    <TimerIcon current={selected === 1 ? true : false} />
                }
            </Button>
            <Button
                icon={<HoodIcon className={`${styles.icon} ${selected === 2 ? styles.selected : ""}`} />}
                iconProps={{ size: "4.2rem", filled: true }}
                classes={selected === 2 ? styles.current : ""}
                style={selected === 2 ? selectedStyle : unselectedStyle}
                onClick={(event) => changeSection(2)}
            >
                <div className={styles.buttonInfo}>
                    <h6>Estou cursando o ensino superior</h6>
                    <p>Preciso de ajuda para organizar horários e ter sanidade mental sem recorrer às drogas e/ou outros métodos ilícitos</p>
                </div>
                {
                    selected === 2 &&
                    <TimerIcon current={selected === 2 ? true : false} />
                }
            </Button>
            <p onClick={() => setSection([2, 1])} className={styles.outro}>Não possuo filiação a nenhuma instituição de ensino</p>
        </div>
        <div ref={progressBar} className={styles.progressBar} />
        <Link href={"/auth/login"}>
            <p className={loginStyles.link}>Já tem uma conta? <span className="click bold">Log in</span></p>
        </Link>
    </motion.div>

    const Section2 = <motion.div
        className={styles.section}
        key={section}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
    >
        <header>
            <h1>Criar sua conta</h1>
            <p>Agora que já sabemos do que você precisa, entre com sua conta Google abaixo para cadastrar-se na plataforma.</p>
            <p><span className='bold'>Lembre-se de permitir o acesso ao Google Drive! </span><br />
                Caso o acesso não seja concedido, você será incapaz de enviar anexos em atividades!</p>
        </header>
        <GoogleButton onClick={authenticate} isLoading={isLoading} />
        <p className={styles.privacy}>Ao se cadastrar, você concorda com os <Link href="/tos" target={"_blank"}>Termos de Serviço</Link> e a <Link target={"_blank"} href="/privacy">Política de Privacidade</Link>.</p>
        <Separator style={separator} orientation='horizontal' />
        <div onClick={returnToSection1} className='row click' style={{ color: "var(--primary-02)", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }} className='material-symbols-rounded '>keyboard_backspace</span>
            <p className={loginStyles.link}>Voltar para o início</p>
        </div>
    </motion.div>

    const Section2_1 = <motion.div
        className={styles.section}
        key={section}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
    >
        <header>
            <h1>Criando sua conta</h1>
            <p>Calma um pouco que estamos apertando uns botões e rodando algumas manivelas para que sua conta seja criada!</p>
        </header>
        <GoogleButton onClick={authenticate} isLoading={isLoading} />
        <Separator style={separator} orientation='horizontal' />
        <div onClick={returnToSection1} className='row click' style={{ color: "var(--primary-02)", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }} className='material-symbols-rounded '>keyboard_backspace</span>
            <p className={loginStyles.link}>Voltar para o início</p>
        </div>
    </motion.div>

    const Section3 = <motion.div
        className={styles.section}
        key={section}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
    >
        <header>
            <h1>Já estamos prontos!</h1>
            <p>Aproveite todas as funcionalidades da plataforma e organize os seus estudos de uma vez por todas.
                <br />
                Nunca mais uma matéria ficará atrasada.</p>
        </header>
        <Link href={"/home"} style={{ width: "100%" }}>
            <Button
                style={{ padding: "1rem 1.5rem", width: "100%" }}
                title='Entrar na plataforma'
            />
        </Link>
        <Separator style={separator} orientation='horizontal' />
    </motion.div>

    const Error = <div>
        <p style={{ color: "var(--primary-02)", textAlign: "center" }}>
            Houve um erro interno. <br /> Por favor, reinicie a página.
        </p>
    </div>

    const MissingScope = <motion.div
        className={styles.section}
        key={section}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
    >
        <ScopeMissing setSection={() => setSection([1, -1])} />
    </motion.div>

    const sections = [Error, Section1, Section2, Section2_1, Section3, MissingScope]

    /*  */

    const googleLogin = useGoogleLogin({
        /* onSuccess: async ({ code }) => {
            const response = await signIn(code, { course: selected as number })
            if (response === 'success') {
                setSection([3, 1])
            } else if (response === 'scopeMissing') {
                setSection([4, 1])
                setLoading(false)
                setSelected(null)
            } else {
                setSection([0, 1])
            }
        }, */
        onError(errorResponse) {
            console.log(errorResponse)
            setLoading(false)
        },
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
        flow: 'auth-code',
        ux_mode: "redirect",
        redirect_uri: process.env.NEXT_PUBLIC_NODE_ENV === "development" ? `http://localhost:3000/auth/register` : `https://estudai.vercel.app/auth/register`
    });


    function authenticate() {
        googleLogin()
        setLoading(true)
    }

    const hasRegisteredRef = useRef(false);

    async function registerUser() {
        if (router.query.code && hasRegisteredRef.current === false) {
            console.log("Registrando")
            hasRegisteredRef.current = true

            const course = parseInt(window.sessionStorage.getItem("course") as string);
            console.log(window.sessionStorage, course)

            const response = await signIn(router.query.code as string, { course: course })
            if (response === 'success') {
                setSection([4, 1])
            } else if (response === 'scopeMissing') {
                setSection([5, 1])
                setLoading(false)
                setSelected(null)
            } else {
                setSection([0, 1])
            }
        }
    }

    useEffect(() => {
        registerUser()
    }, [])

    return (
        <main className={loginStyles.holder}>
            <Head>
                <title>Criar uma conta</title>
            </Head>
            <div className={`${loginStyles.container} ${section === 4 ? loginStyles.fullScreen : ""}`} style={{ gap: "3.5rem" }}>
                <Logo width={121.19} height={58.72} style={{ minHeight: 58 }} fill={`var(--primary-02)`} />
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    {sections[section]}
                </AnimatePresence>
            </div>
            <Device additionalClass={loginStyles.device} />
            {/* {
                !router.query.code && <EarlyAccessModalPreset />
            } */}
        </main>
    )
}

export default Register;