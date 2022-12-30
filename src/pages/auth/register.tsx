import { useEffect, useRef, useState } from 'react';

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
import Translate, { TranslateText } from '../../components/Translate';
import { NextPageWithTheme } from '..';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    return {
        props: {

        }
    }
}

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

const Register: NextPageWithTheme = () => {
    const router = useRouter();

    const { signIn } = useAuth();
    const [isLoading, setLoading] = useState(router.query.code !== undefined);

    const [[section, direction], setSection] = useState(router.query.code ? [3, 1] : [1, 1]);
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
            <h1><Translate>Organize your study flow</Translate>.</h1>
            <p><Translate>Choose which type of course you fit in so we can prepare the platform for you</Translate>.</p>
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
                    <h6><Translate>I'm attending</Translate> <Translate>elementary school</Translate></h6>
                    <p><Translate>I need help reviewing core subjects</Translate></p>
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
                    <h6><Translate>I'm attending</Translate> <Translate>high school</Translate></h6>
                    <p><Translate>I need help organizing schedules, remembering homework, studying for exams and staying sane</Translate> </p>
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
                    <h6><Translate>I'm attending</Translate> <Translate>college</Translate></h6>
                    <p><Translate>I need help with my researches, projects, thesis, etc.</Translate></p>
                </div>
                {
                    selected === 2 &&
                    <TimerIcon current={selected === 2 ? true : false} />
                }
            </Button>
            <p onClick={() => setSection([2, 1])} className={styles.outro}>I am not affiliated with any educational institution</p>
        </div>
        <div ref={progressBar} className={styles.progressBar} />
        <Link href={"/auth/login"}>
            <p className={loginStyles.link}><Translate>Already have an account?</Translate> <span className="click bold">Log in</span></p>
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
            <h1><Translate  >Create your account</Translate></h1>
            <p><Translate>Now that we know what you need, enter your Google account below to register on the platform.</Translate></p>
            <p><span className='bold'><Translate>Remember to allow access to Google Drive!</Translate> </span><br />
                <Translate>If access is not granted, you will be unable to upload attachments in activities!</Translate></p>
        </header>
        <GoogleButton onClick={authenticate} isLoading={isLoading} />
        <p className={styles.privacy}><Translate>By registering, you agree to the</Translate> <Link href="/tos" target={"_blank"}><Translate>Terms of Service</Translate></Link> <Translate>and</Translate> <Link target={"_blank"} href="/privacy"><Translate>Privacy Policy</Translate></Link>.</p>
        <Separator style={separator} orientation='horizontal' />
        <div onClick={returnToSection1} className='row click' style={{ color: "var(--primary-02)", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }} className='material-symbols-rounded '>keyboard_backspace</span>
            <p className={loginStyles.link}><Translate>Back to beggining</Translate></p>
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
            <h1><Translate>Creating your account</Translate></h1>
            <p><Translate>Don't worry, we're pressing a few buttons and turning a few handles to get your account created!</Translate></p>
        </header>
        <GoogleButton onClick={authenticate} isLoading={isLoading} />
        <Separator style={separator} orientation='horizontal' />
        <div onClick={returnToSection1} className='row click' style={{ color: "var(--primary-02)", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }} className='material-symbols-rounded '>keyboard_backspace</span>
            <p className={loginStyles.link}><Translate>Back to beggining</Translate></p>
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
            <h1><Translate>We're ready</Translate>!</h1>
            <p><Translate>Take advantage of all the features of the platform and organize your studies once and for all.</Translate>
                <br />
                <Translate>A subject will never be accumulated again.</Translate></p>
        </header>
        <Link href={{ pathname: "/home", query: { newAccount: true } }} style={{ width: "100%" }}>
            <Button
                style={{ padding: "1rem 1.5rem", width: "100%" }}
                title={TranslateText("Enter the platform")}
            />
        </Link>
        <Separator style={separator} orientation='horizontal' />
    </motion.div>

    const Error = <div>
        <p style={{ color: "var(--primary-02)", textAlign: "center" }}>
            <Translate>There was an internal error.</Translate> <br /> <Translate>Please restart the page.</Translate>
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

    const googleLogin = useGoogleLogin({
        /* onSuccess: async ({ code }) => {
            setLoading(true)
            registerUser(code)
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
    }

    const hasRegisteredRef = useRef(false);

    async function registerUser(codeParam?: string) {
        const code = codeParam || router.query.code
        if (code && hasRegisteredRef.current === false) {
            console.log("Registrando")
            hasRegisteredRef.current = true
            setSection([3, 1])

            const course = parseInt(window.sessionStorage.getItem("course") as string);
            console.log(window.sessionStorage, course)

            const response = await signIn(code as string, { course: course })
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
        if (!router.isReady) return;
        registerUser()
    }, [router.isReady])

    return (
        <main className={loginStyles.holder}>
            <Head>
                <title>{TranslateText("Create an account")}</title>
            </Head>
            <div className={`${loginStyles.container} ${section === 4 ? loginStyles.fullScreen : ""}`} style={{ gap: "3.5rem" }}>
                <motion.div
                    layout
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <Logo width={121.19} height={58.72} style={{ minHeight: 58 }} fill={`var(--primary-02)`} />
                </motion.div>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
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

Register.theme = "default"
export default Register;