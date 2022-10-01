import { useEffect, useRef } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

// Stylesheets
import styles from "./sidebar.module.css";

// Authentication
import { useAuth } from "../../contexts/AuthContext";

import LogoutModalPreset from "../Modal/Presets/LogoutModal";

const sections = ["home", "groups", "settings"]

export default function Sidebar() {
    const { signOut } = useAuth();

    const router = useRouter();
    const section = router.asPath.split("/")[1] as string;

    const sectionBar = useRef<HTMLDivElement | null>(null);

    const dashboardButton = useRef<HTMLSpanElement | null>(null);
    const groupsButton = useRef<HTMLSpanElement | null>(null);
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

    return <nav className={`${styles.container} pulse`}>
        <Link href={`/home`}>
            <span ref={dashboardButton} className={`material-symbols-rounded ${section === "home" ? "filled" : "outlined"}`}>space_dashboard</span>
        </Link>

        <Link href={"/groups"}>
            <span ref={groupsButton} className={`material-symbols-rounded ${section === "groups" ? "filled" : "outlined"}`}>group</span>
        </Link>

        <Link href={"/settings"}>
            <span ref={settingsButton} className={`material-symbols-rounded ${section === "settings" ? "filled" : "outlined"}`}>settings</span>
        </Link>
        <span onClick={() => setLogoutModalVisible(true)} className={`material-symbols-rounded`}>exit_to_app</span>
        <div ref={sectionBar} className={styles.sectionBar} />
        {LogoutModal}
    </nav>
}