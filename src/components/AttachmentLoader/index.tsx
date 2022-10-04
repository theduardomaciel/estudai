import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

// Stylesheets
import createTaskStyles from "../../styles/CreateTask.module.css"
import styles from "./styles.module.css";
import buttonStyles from '../Button/button.module.css';

// Components
import Button from "../Button"
import Section from "../Section"

// Icons
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";
import { Attachment } from "../../types/Attachment";

let counter = 0;

type Props = React.StyleHTMLAttributes<HTMLInputElement> & {
    attachments: Attachment[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
};

export default function AttachmentsLoader({ attachments, setAttachments, ...rest }: Props) {
    const dragFrame = useRef<HTMLDivElement | null>(null);

    const removeDragStyle = () => {
        if (dragFrame.current) {
            dragFrame.current.classList.remove(styles.dragEnter)
        }
    }

    function formatNewFile(file: File) {
        const newAttachment = {
            name: file.name,
            type: file.type,
            link: file.toString(),
        } as Attachment;
        return newAttachment
    }

    function processFile(type: 'input' | 'drag', triggerEvent: any) {
        if (type === "drag") {
            const event = triggerEvent as React.DragEvent<HTMLDivElement>;
            if (event.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                const items = Array.from(event.dataTransfer.items) as Array<DataTransferItem>;
                items.forEach((item, i) => {
                    // If dropped items aren't files, reject them
                    if (item.kind === 'file') {
                        const file = item.getAsFile() as File;
                        console.log(file);
                        const newAttachment = formatNewFile(file)
                        // [...previousState.myArray, 'new value']
                        setAttachments(attachments.concat(newAttachment))
                    }
                });
            } /* else {
                const items = Array.from(event.dataTransfer.items)
                // Use DataTransfer interface to access the file(s)
                items.forEach((items, i) => {
                    const file = items as File;
                    console.log(`… file[${i}].name = ${file.name}`);
                });
            } */
        } else if (type === "input") {
            const event = triggerEvent as React.ChangeEvent<HTMLInputElement>;
            const files = event.currentTarget.files as FileList;
            const file = files[0] as File;
            if (file) {
                console.log(file)
                const newAttachment = formatNewFile(file)
                // [...previousState.myArray, 'new value']
                setAttachments(attachments.concat(newAttachment))
            }
        }
    }

    const Attachment = (props: Attachment) => <li key={props.id} className={styles.attachment}>
        <div className={styles.header}>
            {
                props.type === "doc" ?
                    <DocAttachment className={styles.icon} />
                    :
                    <PDFAttachment className={styles.icon} />
            }
            <span className={`material-symbols-rounded ${styles.close}`} onClick={() => {
                let array = [...attachments]; // make a separate copy of the array
                const index = parseInt(props.id as string);
                console.log(props.id, index, array)
                if (index !== -1) {
                    array.splice(index, 1);
                    setAttachments(array)
                    console.log("Anexo removido com sucesso!")
                }
            }}>
                close
            </span>
        </div>
        <p>{props.name}</p>
        <div className={styles.classes}>

        </div>
    </li>

    const hasFiles = attachments.length !== 0;
    const listItems = attachments.map((file, index) => <Attachment id={index.toString()} type={file.type} name={file.name} />);

    return <div className={createTaskStyles.column} {...rest}>
        <div className='header'>
            <Section title='Anexos' />
            <Button
                style={{ backgroundColor: "var(--primary-02)", padding: "0.5rem 1rem", border: "1px solid var(--primary-04)" }}
                icon={"link"}
                title='Adicionar link'
            />
        </div>
        <div
            ref={dragFrame}
            className={styles.attachmentHolder}
            onDragEnter={(event) => {
                event.preventDefault();
                counter++;

                if (dragFrame.current) {
                    dragFrame.current.classList.add(styles.dragEnter)
                }
            }}
            onDragLeave={() => {
                counter--;
                if (counter === 0) {
                    removeDragStyle()
                }
            }}
            onDragOver={(event) => {
                //console.log('File(s) in drop zone');
                // Prevent default behavior (Prevent file from being opened)
                event.preventDefault();
            }}
            onDrop={(event) => {
                console.log('File dropped');
                // Prevent default behavior (Prevent file from being opened)
                event.preventDefault();
                removeDragStyle()
                processFile("drag", event)
            }}
            /* onClick={() => attachments.length > 0 } */
            style={{ justifyContent: !hasFiles ? "center" : "flex-start", alignItems: !hasFiles ? "center" : "flex-start" }}
        >
            <div className={styles.guide} >
                <div className={styles.beforeHover}>
                    {
                        !hasFiles &&
                        <>
                            <h6>Arraste arquivos para cá</h6>
                            <p>ou</p>
                        </>
                    }
                    <label className={`${styles.search} ${buttonStyles.button}`} htmlFor="attachmentUpload">Procurar</label>
                    <input onChange={(event) => processFile('input', event)} type={"file"} name="" id="attachmentUpload" />
                </div>
                <div className={styles.afterHover}>
                    <span className={`material-symbols-rounded filled`}>
                        upload_file
                    </span>
                    <h6>Carregar</h6>
                </div>
            </div>
            <ul>
                {listItems}
            </ul>
        </div>
    </div>
}