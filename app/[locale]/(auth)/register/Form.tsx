"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

// Icons
import Logo from "/public/logo.svg";
import CheckCircleIcon from "@material-symbols/svg-600/rounded/check_circle.svg";

import BackpackIcon from "@material-symbols/svg-600/rounded/backpack-fill.svg";
import BookIcon from "@material-symbols/svg-600/rounded/book-fill.svg";
import HoodIcon from "/public/icons/hood.svg";

// Stylesheets
import loginStyles from "../styles.module.css";
import styles from "./register.module.css";

// Components
import Button from "@/components/ui/Button";
import Separator from "@/components/Separator";
import Anchor from "@/components/ui/Button/Anchor";
import { GoogleButton } from "../components/Google";
import { Error, Footer, ScopeMissing } from "../components/Sections";

// Authentication
import { useGoogleLogin } from "@react-oauth/google";
import { signIn } from "@/lib/auth";

// Interfaces
import type { Course } from "@prisma/client";
import type { Translations } from "@/i18n/hooks";

const unselectedStyle = {
    padding: "2rem 2.5rem",
    gap: "2.5rem",
    justifyContent: "flex-start",
    backgroundColor: "var(--neutral)",
    border: "2px solid var(--primary-03)",
    color: "var(--primary-02)",
    width: "100%",
    borderRadius: "1rem",
};

const selectedStyle = {
    padding: "2rem 2.5rem",
    gap: "2.5rem",
    justifyContent: "flex-start",
    backgroundColor: "var(--primary-02)",
    border: "2px solid var(--primary-03)",
    color: "var(--neutral)",
    width: "100%",
    borderRadius: "1rem",
};

const separator = {
    backgroundColor: "var(--primary-02)",
    width: "35%",
    height: 1,
};

const TimerIcon = () => (
    <CheckCircleIcon fontSize={24} className={`${styles.timer} icon`} />
);

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    },
};

const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
};

const INTERVAL_TIME = 4;

interface Props {
    code?: string;
    dict: Translations["auth"];
}

export default function RegisterForm({ code, dict }: Props) {
    const [isLoading, setLoading] = useState(code ? true : false);

    const googleLogin = useGoogleLogin({
        /* onSuccess: async ({ code }) => {
            setLoading(true)
            registerUser(code)
        }, */
        onError(errorResponse) {
            console.log(errorResponse);
            setLoading(false);
        },
        onNonOAuthError(nonOAuthError) {
            console.log(nonOAuthError);
            setLoading(false);
        },
        scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
        flow: "auth-code",
        ux_mode: "redirect",
        redirect_uri:
            process.env.NEXT_PUBLIC_NODE_ENV === "development"
                ? `http://localhost:3000/register`
                : `https://estudai.vercel.app/register`,
    });

    const t = dict.register;

    const [[section, direction], setSection] = useState(code ? [3, 1] : [1, 1]);
    const [selected, setSelected] = useState<Course | null>(null);

    const progressBar = useRef<HTMLDivElement>(null);

    const [currentTimeout, setCurrentTimeout] = useState<ReturnType<
        typeof setTimeout
    > | null>(null);

    const changeSection = (newSection: Course) => {
        console.log("Alterando seção para", newSection);
        // Removemos a animação da barra de progresso
        if (progressBar.current) {
            console.log("Reiniciando a animação da barra de progresso.");
            progressBar.current.classList.remove(styles.animate);
        }

        console.log("Limpando timeout da animação da barra de progresso.");
        clearTimeout(currentTimeout as ReturnType<typeof setTimeout>);
        setCurrentTimeout(null);

        // Caso o usuário selecione novamente a mesma opção, cancelamos a seleção
        if (newSection === selected) {
            setSelected(null);
        } else {
            // Alteramos a seção selecionada pelo usuário
            setSelected(newSection);
            console.log(newSection);
            if (newSection) {
                window.sessionStorage.setItem(
                    "course",
                    newSection.toString() as string
                );
            }

            setTimeout(() => {
                // Iniciamos a animação da barra de progresso
                if (progressBar.current) {
                    console.log("Animando barra para o 100%");
                    progressBar.current.classList.toggle(styles.animate);
                }
            }, 250);

            const timeout = setTimeout(() => {
                console.log("timeout", currentTimeout);
                console.log(
                    `Avançando seção com a opção ${selected} selecionada.`
                );

                // Progredimos para a próxima seção
                setSection([2, 1]);

                // Removemos a animação da barra de progresso
                if (progressBar.current) {
                    progressBar.current.classList.toggle(styles.animate);
                }
                clearTimeout(currentTimeout as ReturnType<typeof setTimeout>);
                setCurrentTimeout(null);
                /* } */
            }, INTERVAL_TIME * 1000);

            setCurrentTimeout(timeout);
        }
    };

    function returnToSection1() {
        setSelected(null);
        setLoading(false);
        setSection([1, -1]);
    }

    const Section1 = (
        <motion.div
            className={styles.section}
            style={{ gap: "1.5rem" }}
            key={section}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
        >
            <header style={{ alignItems: "center", textAlign: "center" }}>
                <h1>{t.section1.title}</h1>
                <p>{t.section1.subtitle}</p>
            </header>
            <div className={styles.cardsHolder}>
                <Button
                    className={selected === "MIDDLE" ? styles.current : ""}
                    style={
                        selected === "MIDDLE" ? selectedStyle : unselectedStyle
                    }
                    onClick={() => changeSection("MIDDLE")}
                >
                    <BackpackIcon
                        className={`${styles.icon} ${
                            selected === "MIDDLE" ? styles.selected : ""
                        } icon`}
                        fontSize={"4.2rem"}
                    />
                    <div className={styles.buttonInfo}>
                        <h6>{t.section1.card1.title}</h6>
                        <p>{t.section1.card1.subtitle}</p>
                    </div>
                    {selected === "MIDDLE" && <TimerIcon />}
                </Button>
                <Button
                    className={selected === "HIGH" ? styles.current : ""}
                    style={
                        selected === "HIGH" ? selectedStyle : unselectedStyle
                    }
                    onClick={() => changeSection("HIGH")}
                >
                    <BookIcon
                        className={`${styles.icon} ${
                            selected === "HIGH" ? styles.selected : ""
                        } icon`}
                        fontSize={"4.2rem"}
                    />
                    <div className={styles.buttonInfo}>
                        <h6>{t.section1.card2.title}</h6>
                        <p>{t.section1.card2.subtitle}</p>
                    </div>
                    {selected === "HIGH" && <TimerIcon />}
                </Button>
                <Button
                    className={selected === "COLLEGE" ? styles.current : ""}
                    style={
                        selected === "COLLEGE" ? selectedStyle : unselectedStyle
                    }
                    onClick={() => changeSection("COLLEGE")}
                >
                    <HoodIcon
                        className={`${styles.icon} ${
                            selected === "COLLEGE" ? styles.selected : ""
                        } icon`}
                        fontSize={"4.2rem"}
                    />
                    <div className={styles.buttonInfo}>
                        <h6>{t.section1.card3.title}</h6>
                        <p>{t.section1.card3.subtitle}</p>
                    </div>
                    {selected === "COLLEGE" && <TimerIcon />}
                </Button>
                <p
                    onClick={() => setSection([2, 1])}
                    className={loginStyles.outro}
                >
                    {t.section1.no_choice}
                </p>
            </div>
            <div ref={progressBar} className={styles.progressBar} />
            <Link href={"/login"}>
                <p className={`${loginStyles.outro} ${loginStyles.static}`}>
                    {t.section1.footer.has_account} {` `}
                    <span className={`${loginStyles.outro}`}>
                        {t.section1.footer.login}
                    </span>
                </p>
            </Link>
        </motion.div>
    );

    const Section2 = (
        <motion.div
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
                <h1>{t.section2.title}</h1>
                <p>{t.section2.subtitle}</p>
                <p>
                    <span className="bold">{t.section2.google_drive.bold}</span>
                    <br />
                    {t.section2.google_drive.text}
                </p>
            </header>
            <GoogleButton
                onClick={() => {
                    setLoading(true);
                    googleLogin();
                }}
                isLoading={isLoading}
                dict={dict}
            />
            <p className={styles.privacy}>
                {t.section2.terms.condition} {` `}
                <Link href="/tos" target={"_blank"}>
                    {t.section2.terms.terms}
                </Link>{" "}
                {` `}
                {t.section2.terms.and} {` `}
                <Link target={"_blank"} href="/privacy">
                    {t.section2.terms.privacy}
                </Link>
                .
            </p>
            <Footer setSection={returnToSection1} dict={dict} />
        </motion.div>
    );

    const Section2_1 = (
        <motion.div
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
                <h1>{t.section2_1.title}</h1>
                <p>{t.section2_1.subtitle}</p>
            </header>
            <GoogleButton
                onClick={googleLogin}
                isLoading={isLoading}
                dict={t}
            />
            <Separator style={separator} orientation="horizontal" />
        </motion.div>
    );

    const Section3 = (
        <motion.div
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
                <h1>{t.section3.title}</h1>
                <p
                    style={{
                        whiteSpace: "pre-line",
                    }}
                >
                    {t.section3.subtitle}
                </p>
            </header>
            <Link
                href={{ pathname: "/home", query: { newAccount: true } }}
                shallow={false}
                style={{ width: "100%" }}
            >
                <Button style={{ padding: "1rem 1.5rem", width: "100%" }}>
                    {t.section3.button}
                </Button>
            </Link>
            <Separator style={separator} orientation="horizontal" />
        </motion.div>
    );

    const MissingScope = (
        <motion.div
            className={styles.section}
            key={section}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
        >
            <ScopeMissing dict={dict} />
        </motion.div>
    );

    const AccountAlreadyExists = (
        <motion.div
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
                <h1>{t.account_already_exists.title}</h1>
                <p
                    style={{
                        whiteSpace: "pre-line",
                    }}
                >
                    <span className="font-bold">
                        {t.account_already_exists.bold}
                    </span>{" "}
                    <br /> <br />
                    {t.account_already_exists.text}
                </p>
            </header>
            <Anchor
                href={{ pathname: "/home", query: { isNewUser: true } }}
                as={"/home"}
                className="w-full py-6 px-[0.85rem]"
            >
                {t.section3.button}
            </Anchor>
            <Separator style={separator} orientation="horizontal" />
        </motion.div>
    );

    const ErrorSection = (
        <Error
            dict={dict}
            setSection={() => {
                setSection([1, 1]);
                setLoading(false);
                toggleFullScreen();
            }}
        />
    );

    const sections = [
        ErrorSection,
        Section1,
        Section2,
        Section2_1,
        Section3,
        MissingScope,
        AccountAlreadyExists,
    ];

    function toggleFullScreen() {
        const container = document.getElementById("authMainContainer");
        if (container) {
            container.classList.toggle(loginStyles.fullscreen);
        }
    }

    function disableFullScreen() {
        const container = document.getElementById("authMainContainer");
        if (container) {
            container.classList.remove(loginStyles.fullscreen);
        }
    }

    const hasRegisteredRef = useRef(false);
    async function registerUser() {
        if (code && hasRegisteredRef.current === false) {
            hasRegisteredRef.current = true;
            setSection([3, 1]);

            const course = window.sessionStorage.getItem("course");

            const response = await signIn(code as string, {
                course: course ?? null,
            });
            console.log(response);
            if (response === "success_created") {
                setSection([4, 1]);
            } else if (response === "success") {
                setSection([6, 1]);
            } else if (response === "scopeMissing") {
                setSection([5, 1]);
                setLoading(false);
            } else {
                setSection([0, 1]);
            }
            toggleFullScreen();
        }
    }

    useEffect(() => {
        registerUser();
        disableFullScreen();
    }, []);

    return (
        <>
            <motion.div
                layout
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <Link href={`/`}>
                    <Logo
                        width={121.19}
                        height={58.72}
                        style={{ minHeight: 58 }}
                        className="click"
                        fill={`var(--primary-02)`}
                    />
                </Link>
            </motion.div>
            <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
            >
                {sections[section]}
            </AnimatePresence>
        </>
    );
}
