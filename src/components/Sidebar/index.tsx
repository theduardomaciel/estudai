import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

// Stylesheets
import styles from "./sidebar.module.css";

// Authentication
import { useAuth } from "../../contexts/AuthContext";

// Icons
import ClubIcon from "/public/icons/club.svg";
import ClubOutlinedIcon from "/public/icons/club_outlined.svg";
import Logo from "/public/logo.svg";

import LogoutModalPreset from "../Modal/Presets/LogoutModal";
import { parseCookies } from "nookies";
import Button from "../Button";

const sections = ["home", "groups", "settings"]

interface Props {
    notAuthenticated?: boolean;
}

export default function Sidebar({ notAuthenticated }: Props) {
    const { 'app.userId': userId } = parseCookies()
    const { signOut } = useAuth();

    const router = useRouter();
    const section = router.asPath.split("/")[1] as string;

    const sectionBar = useRef<HTMLDivElement | null>(null);

    const dashboardButton = useRef<HTMLSpanElement | null>(null);
    const groupsButton = useRef<HTMLSpanElement | null>(null);
    const clubButton = useRef<any | null>(null);
    const settingsButton = useRef<HTMLSpanElement | null>(null);

    function moveSectionBar(toSection: string) {
        const sectionBarElement = sectionBar.current as HTMLDivElement;

        const movement = (button: HTMLSpanElement) => {
            const newBarPosition = `${button.offsetTop + (button.offsetHeight / 2) - (sectionBarElement.offsetHeight / 2)}px`;
            sectionBarElement.style.top = newBarPosition;

            sessionStorage.setItem('lastBarPosition', sectionBarElement.style.top)
        }

        switch (toSection) {
            case sections[0]:
                const buttonDash = dashboardButton.current as HTMLSpanElement;
                movement(buttonDash)
                break;
            case sections[1]:
                const buttonGroup = groupsButton.current as HTMLSpanElement;
                movement(buttonGroup)
                break;
            case sections[2]:
                const buttonSetting = settingsButton.current as HTMLSpanElement;
                movement(buttonSetting)
                break;
            default:
                break;
        }
    }

    const { setLogoutModalVisible, LogoutModal } = LogoutModalPreset();

    useEffect(() => {
        if (sectionBar.current) {
            const lastBarPosition = window !== undefined && window.sessionStorage.getItem('lastBarPosition') as string;
            sectionBar.current.style.top = lastBarPosition as string;
        }
        moveSectionBar(section ? section : "home")
    }, [])

    return <>
        <nav className={`${styles.container} pulse ${notAuthenticated ? styles.unauthenticated : ""}`}>
            {/* <Link href={"/club"}>
                {
                    section === "club" ?
                        <div ref={clubButton}>
                            <ClubIcon className={'click'} />
                        </div>
                        :
                        <div ref={clubButton}>
                            <ClubOutlinedIcon className={'click'} />
                        </div>
                }
            </Link> */}

            {/* <Link href={"/settings"}>
                <a href="">
                    <span ref={settingsButton} className={`material-symbols-rounded ${section === "settings" ? "filled" : "outlined"}`}>settings</span>
                </a>
            </Link> */}
            {
                !notAuthenticated ?
                    <>
                        <Link href={`/home`}>
                            <span ref={dashboardButton} className={`material-symbols-rounded ${section === "home" ? "filled" : "outlined"}`}>space_dashboard</span>
                        </Link>

                        <Link href={"/groups"}>
                            <span ref={groupsButton} className={`material-symbols-rounded ${section === "groups" ? "filled" : "outlined"}`}>group</span>
                        </Link>
                        <span onClick={() => setLogoutModalVisible(true)} className={`material-symbols-rounded`}>exit_to_app</span>

                        <div ref={sectionBar} className={styles.sectionBar} />
                    </>
                    :
                    <div className={styles.authenticationWarning}>
                        <h6>Organize seus estudos.</h6>
                        <div className={styles.row}>
                            <p>Crie uma conta no <span>estudaí{/* <Logo fill={"var(--light)"} width={72} height={24} /> */}</span> para aproveitar todas as funções da plataforma.</p>
                        </div>
                        <div className={styles.row}>
                            <Link href={`/auth/login`} style={{ width: "49%" }}>
                                <Button
                                    title="Entrar"
                                    style={{ border: "1px solid var(--light)", borderRadius: "5rem", padding: "0.75rem 2.25rem", width: "100%" }}
                                />
                            </Link>
                            <Link href={`/auth/register`} style={{ width: "49%" }}>
                                <Button
                                    title="Cadastrar"
                                    style={{
                                        border: "1px solid var(--light)",
                                        borderRadius: "5rem",
                                        padding: "0.75rem 2.25rem",
                                        width: "100%",
                                        backgroundColor: "var(--light)",
                                        color: "var(--primary-02"
                                    }}
                                />
                            </Link>
                        </div>
                    </div>
            }
        </nav>
        {LogoutModal}
    </>
}