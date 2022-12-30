import { MutableRefObject, useEffect, useRef, useState } from "react";

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
import useScreenSize from "../../hooks/useScreenSize";
import Translate, { TranslateText } from "../Translate";

const sections = ["home", "groups", "settings"]

interface Props {
    notAuthenticated?: boolean;
}

/* type ButtonsType = {
    [key: string]: MutableRefObject<HTMLSpanElement | null>;
} */

export default function Sidebar({ notAuthenticated }: Props) {
    const router = useRouter();
    const section = router.asPath.split("/")[1] as string;

    const sectionBar = useRef<HTMLDivElement | null>(null);

    function moveSectionBar(toSection: string) {
        const sectionBarElement = sectionBar.current as HTMLDivElement;
        const button = document.getElementById(`${toSection}Button`) as HTMLSpanElement;

        if (button) {
            const newBarPosition = `${button.offsetTop + (button.offsetHeight / 2) - (sectionBarElement.offsetHeight / 2)}px`;
            sectionBarElement.style.top = newBarPosition;

            sessionStorage.setItem('lastBarPosition', sectionBarElement.style.top)
        }
    }

    useEffect(() => {
        if (sectionBar.current) {
            const lastBarPosition = window !== undefined && window.sessionStorage.getItem('lastBarPosition') as string;
            sectionBar.current.style.top = lastBarPosition as string;
        }
        moveSectionBar(section ? section : "home")
    }, [])

    //console.log(notAuthenticated)

    return <>
        <nav className={`${styles.container} pulse ${notAuthenticated === true ? styles.unauthenticated : ""}`}>
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

            <div className={styles.authenticationWarning}>
                <h6><Translate>Organize your study flow</Translate>.</h6>
                <div className={styles.row}>
                    <p><Translate>Create an account at</Translate> <span>estudaí{/* <Logo fill={"var(--light)"} width={72} height={24} /> */}</span> <Translate>to take advantage of all the functions of the platform.</Translate></p>
                </div>
                <div className={styles.row}>
                    <Link href={`/auth/login`}>
                        <Button
                            title={TranslateText("Sign in")}
                            style={{ border: "1px solid var(--light)", borderRadius: "5rem", padding: "0.75rem 2.25rem", width: "100%" }}
                        />
                    </Link>
                    <Link href={`/auth/register`} >
                        <Button
                            title={TranslateText("Sign up")}
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

            {
                notAuthenticated === true || !notAuthenticated &&
                <>
                    <Link href={`/home`}>
                        <span id="homeButton" className={`material-symbols-rounded ${section === "home" ? "filled" : "outlined"}`}>space_dashboard</span>
                    </Link>

                    <Link href={"/groups"}>
                        <span id="groupsButton" className={`material-symbols-rounded ${section === "groups" ? "filled" : "outlined"}`}>group</span>
                    </Link>

                    <Link href={"/marketplace"}>
                        <span id="marketplaceButton" className={`material-symbols-rounded ${section === "marketplace" ? "filled" : "outlined"}`}>book</span>
                    </Link>
                    <Link href={"/settings"} className={styles.settings}>
                        <span
                            id="settingsButton"
                            className={`material-symbols-rounded ${section === "settings" ? "filled" : "outlined"}`}>
                            settings
                        </span>
                    </Link>
                    <div ref={sectionBar} className={styles.sectionBar} />
                </>
            }

            {/* <span onClick={() => setLogoutModalVisible(true)} className={`material-symbols-rounded`}>exit_to_app</span> */}

        </nav>
    </>
}