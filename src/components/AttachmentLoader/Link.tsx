import { Dispatch, SetStateAction } from "react";

import fileStyles from "./File/styles.module.css";

interface Props {
    link: string;
    index: number;
    links?: string[];
    setLinks?: Dispatch<SetStateAction<string[]>>;
}

export default function LinkAttachment({ link, index, links, setLinks }: Props) {
    async function removeLink() {
        if (links && setLinks) {
            let array = [...links];
            array.splice(index, 1);
            setLinks(array)
            console.log(`Link ${index} removido com sucesso.`)
        }
    }

    return (
        <li key={index} className={fileStyles.attachment}>
            <div className={fileStyles.header}>
                <span style={{ color: "var(--primary-02)" }} className="material-icons-round">link</span>
                {
                    links && setLinks &&
                    <span className={`material-icons-round ${fileStyles.close}`} onClick={removeLink}> close  </span>
                }
            </div>
            <a
                href={link}
                target={"_blank"}
                rel="noreferrer"
                className={`${fileStyles.fileName}`}
                style={{ textDecoration: "underline", cursor: "pointer" }}
            >
                {link}
            </a>
        </li>
    )
}