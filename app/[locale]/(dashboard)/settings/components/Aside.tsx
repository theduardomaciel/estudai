"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import styles from "@/styles/Settings.module.css";

// Icons
import ExitIcon from "@material-symbols/svg-600/rounded/exit_to_app.svg";
import ChevronLeft from "@material-symbols/svg-600/rounded/chevron_left.svg";
import ChevronRight from "@material-symbols/svg-600/rounded/chevron_right.svg";

// Components
import Modal, { ModalButton } from "@/components/ui/Modal";

// Internationalization
import { Translations } from "@/i18n/hooks";

// Utils
import { signOut } from "@/lib/auth";

const SECTIONS = [
    "account",
    "connections",
    "preferences",
    "personalization",
    "language",
];

interface Props {
    dict: Translations["settings"]["sections"];
    modalDict: Translations["modal"];
    /* searchParams?: Record<string, string> | null | undefined; */
}

export default function SettingsAside({ dict, modalDict }: Props) {
    const pathname = usePathname();
    const purePathname = pathname.split("/")[3]; // We use index 3 to match locale on pathname (and ignore "/settings")

    const currentActive = SECTIONS.findIndex(
        (section) => section === purePathname
    );

    const searchParams = useSearchParams();
    const showLogoutModal = !!searchParams?.get("logout");

    const [isLoading, setLoading] = useState(false);

    return (
        <div className={styles.menu}>
            <ChevronLeft
                className={`icon ${styles.chevron} min-w-[2.4rem]`}
                color={"var(--primary-02)"}
                fontSize={"2.4rem"}
            />
            <ul className={styles.sections}>
                <Link href={`/settings`}>
                    <li
                        className={`${styles.section} ${
                            currentActive === -1 ? styles.selected : ""
                        }`}
                    >
                        {dict.account}
                    </li>
                </Link>
                <Link href={`/settings/connections`}>
                    <li
                        className={`${styles.section} ${
                            currentActive === 1 ? styles.selected : ""
                        }`}
                    >
                        {dict.connections}
                    </li>
                </Link>
                <Link href={`/settings/preferences`}>
                    <li
                        className={`${styles.section} ${
                            currentActive === 2 ? styles.selected : ""
                        }`}
                    >
                        {dict.preferences}
                    </li>
                </Link>
                <Link href={`/settings/customization`}>
                    <li
                        className={`${styles.section} ${
                            currentActive === 3 ? styles.selected : ""
                        }`}
                    >
                        {dict.customization}
                    </li>
                </Link>
                <Link href={`/settings/language`}>
                    <li
                        className={`${styles.section} ${
                            currentActive === 4 ? styles.selected : ""
                        }`}
                    >
                        {dict.language}
                    </li>
                </Link>
                <Link href={`${pathname}?logout=true`}>
                    <li
                        className={`${styles.section} ${styles.exit}`}
                        style={{ color: "var(--red-01)" }}
                    >
                        {dict.logout}
                    </li>
                </Link>
            </ul>
            <ChevronRight
                className={`icon ${styles.chevron} min-w-[2.4rem]`}
                color={"var(--primary-02)"}
                fontSize={"2.4rem"}
            />
            {showLogoutModal && (
                <Modal
                    icon={ExitIcon}
                    color={`var(--primary-02)`}
                    title={modalDict.logout.title}
                    buttons={[
                        <ModalButton
                            className="w-full"
                            onClick={() => {
                                setLoading(true);
                                signOut();
                            }}
                            isLoading={isLoading}
                        >
                            <ExitIcon className="icon text-2xl text-neutral" />
                            {modalDict.logout.button}
                        </ModalButton>,
                    ]}
                    suppressReturn={isLoading}
                    headerProps={{ preset: "big" }}
                    dict={modalDict.default}
                >
                    <p>{modalDict.logout.description}</p>
                </Modal>
            )}
        </div>
    );
}
