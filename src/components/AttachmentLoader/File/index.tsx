import React, { Dispatch, SetStateAction } from "react"

// Drag 'n drop

// Stylesheets
import styles from "./styles.module.css";

// Icons
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";
import { Attachment } from "../../../types/Attachment";

interface Props {
    attachments: Attachment[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
    file: Attachment;
    id: string;
};

export default function File({ attachments, setAttachments, id, file }: Props) {
    return (
        <li key={id} className={styles.attachment}>
            <div className={styles.header}>
                {
                    file.type === "doc" ?
                        <DocAttachment className={styles.icon} />
                        :
                        <PDFAttachment className={styles.icon} />
                }
                <span className={`material-symbols-rounded ${styles.close}`} onClick={() => {
                    let array = [...attachments]; // make a separate copy of the array
                    const index = parseInt(id);
                    console.log(id, index, array)
                    if (index !== -1) {
                        array.splice(index, 1);
                        setAttachments(array)
                        console.log("Anexo removido com sucesso!")
                    }
                }}>
                    close
                </span>
            </div>
            <p>{file.name}</p>
            <div className={styles.classes}>

            </div>
        </li>
    );
}