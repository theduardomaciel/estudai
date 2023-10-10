import Link from "next/link";

import styles from "../styles.module.css";
import ArrowLeftIcon from "@material-symbols/svg-600/rounded/keyboard_backspace.svg";

// Components
import Separator from "@/components/Separator";
import Anchor from "@/components/ui/Button/Anchor";

interface SectionProps {
    setSection?: () => void;
    dict: any;
}

export const Footer = ({ setSection, dict: t }: SectionProps) => {
    return (
        <footer
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
            }}
        >
            <Separator
                style={{ backgroundColor: "var(--primary-02)", width: "10rem" }}
                orientation="horizontal"
            />
            <div
                onClick={setSection}
                className="flex flex-row click"
                style={{
                    color: "var(--primary-02)",
                    justifyContent: "center",
                    gap: "0.5rem",
                }}
            >
                <ArrowLeftIcon className="icon" fontSize={16} />
                <p className={styles.outro}>{t.footer.back}</p>
            </div>
        </footer>
    );
};

export const ScopeMissing = ({ dict: t }: SectionProps) => {
    return (
        <div className={styles.section}>
            <header>
                <h1>{t.scope_missing.title}</h1>
                <p>
                    <strong>{t.scope_missing.bold}</strong> <br /> <br />
                    {t.scope_missing.text}
                </p>
            </header>
            <div className="flex flex-col items-center justify-center gap-y-5 w-full">
                <Anchor
                    className="w-full px-8 py-[0.85rem]"
                    href={`/settings/connections`}
                >
                    {t.scope_missing.buttons.accept}
                </Anchor>
                <Link href={`/home`}>
                    <p className={styles.outro}>
                        {t.scope_missing.buttons.deny}
                    </p>
                </Link>
            </div>
            <Separator
                style={{ backgroundColor: "var(--primary-02)", width: "10rem" }}
                orientation="horizontal"
            />
        </div>
    );
};

export const Error = ({ setSection, dict: t }: SectionProps) => {
    return (
        <div className={styles.section}>
            <header>
                <h1>{t.error.title}</h1>
                <p style={{ whiteSpace: "pre-line" }}>
                    <strong>{t.error.bold}</strong> <br />
                    {t.error.text}
                </p>
            </header>
            {setSection && <Footer setSection={setSection} dict={t} />}
        </div>
    );
};
