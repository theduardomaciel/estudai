import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import styles from "./sidebar.module.css";

const sections = ["dashboard", "groups", "settings"]

export default function Sidebar() {
    const router = useRouter();
    const section = router.asPath.split("/")[1] as string;

    const sectionBar = useRef<HTMLDivElement | null>(null);

    const lastBarPosition = sessionStorage.getItem('lastBarPosition') as string;

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

    useEffect(() => {
        moveSectionBar(section ? section : "dashboard")
    }, [])

    return <nav className={`${styles.container} pulse`}>
        <Link href={`/`}>
            <span ref={dashboardButton} className={`material-symbols-rounded ${section === "" ? "filled" : "outlined"}`}>space_dashboard</span>
        </Link>

        <Link href={"/groups"}>
            <span ref={groupsButton} className={`material-symbols-rounded ${section === "groups" ? "filled" : "outlined"}`}>group</span>
        </Link>

        <Link href={"/settings"}>
            <span ref={settingsButton} className={`material-symbols-rounded ${section === "settings" ? "filled" : "outlined"}`}>settings</span>
        </Link>
        <span className={`material-symbols-rounded`}>exit_to_app</span>
        <div ref={sectionBar} style={{ top: lastBarPosition ? lastBarPosition : 0 }} className={styles.sectionBar} />

    </nav>
}