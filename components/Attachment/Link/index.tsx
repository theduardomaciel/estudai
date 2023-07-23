import { Dispatch, SetStateAction } from "react";

import styles from "../styles.module.css";

interface Props {
    link: string;
    index: number;
    links?: string[];
    setLinks?: Dispatch<SetStateAction<string[]>>;
}

export default function LinkAttachment({
    link,
    index,
    links,
    setLinks,
}: Props) {
    async function removeLink() {
        if (links && setLinks) {
            let array = [...links];
            array.splice(index, 1);
            setLinks(array);
            console.log(`Link ${index} removido com sucesso.`);
        }
    }

    return (
        <li key={index} className={styles.attachment}>
            <div className={styles.header}>
                <span
                    style={{ color: "var(--primary-02)" }}
                    className="material-icons-rounded"
                >
                    link
                </span>
                {links && setLinks && (
                    <span
                        className={`material-icons-rounded ${styles.close}`}
                        onClick={removeLink}
                    >
                        {" "}
                        close{" "}
                    </span>
                )}
            </div>
            <a
                href={link}
                target={"_blank"}
                rel="noreferrer"
                className={`${styles.fileName}`}
                style={{ textDecoration: "underline", cursor: "pointer" }}
            >
                {link}
            </a>
        </li>
    );
}
