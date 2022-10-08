import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"

// Stylesheets
import createTaskStyles from "../../styles/CreateTask.module.css"
import styles from "./styles.module.css";
import buttonStyles from '../Button/button.module.css';

// Components
import Button from "../Button"
import Section from "../Section"
import File from "./File";
import AttachmentTag from "./Tag";

// Types
import { Attachment } from "../../types/Attachment";
import { useAppContext } from "../../contexts/AppContext";

type Props = React.StyleHTMLAttributes<HTMLInputElement> & {
    attachments: Attachment[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
    /* attachments: MutableRefObject<Attachment[]>; */
};

export default function AttachmentsLoader({ attachments, setAttachments, ...rest }: Props) {
    const dragFrame = useRef<HTMLDivElement | null>(null);

    const counter = useRef<number>(0);
    const { hasGoogleAuthentication } = useAppContext();

    const removeDragStyle = () => {
        if (dragFrame.current) {
            dragFrame.current.classList.remove(styles.dragEnter)
        }
    }

    function formatNewFile(file: File) {
        const preAttachment = {
            name: file.name,
            type: file.type,
            tags: [],
            link: file,
        }
        setAttachments(attachments.concat(preAttachment))
    }

    const hasFiles = attachments.length !== 0;
    const listItems = attachments.map((attach, index) => {
        return <File key={`card_${index}`} attachmentIndex={index} attachments={attachments} setAttachments={setAttachments} />
    });

    async function processFile(type: 'input' | 'drag', triggerEvent: any) {
        if (type === "drag") {
            const event = triggerEvent as React.DragEvent<HTMLDivElement>;
            if (event.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                const items = Array.from(event.dataTransfer.items) as Array<DataTransferItem>;
                items.forEach(async (item, i) => {
                    // If dropped items aren't files, reject them
                    if (item.kind === 'file') {
                        const file = item.getAsFile() as File;

                        if (file) {
                            console.log(file, 'Iniciando processo de upload do arquivo.')
                            formatNewFile(file)
                        }
                    }
                });
            }
        } else if (type === "input") {
            const event = triggerEvent as React.ChangeEvent<HTMLInputElement>;
            const files = event.currentTarget.files as FileList;
            const file = files[0] as File;

            if (file) {
                console.log(file, 'Iniciando processo de upload do arquivo.')
                formatNewFile(file)
            }
        }
    }

    return <div className={createTaskStyles.column} {...rest}>
        <div className='header'>
            <Section title='Anexos' />
            <Button
                style={{ backgroundColor: "var(--primary-02)", padding: "0.5rem 1rem", border: "1px solid var(--primary-04)" }}
                icon={"link"}
                title='Adicionar link'
            />
        </div>
        {
            hasGoogleAuthentication ?
                <div
                    ref={dragFrame}
                    className={styles.attachmentHolder}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        counter.current++;

                        if (dragFrame.current) { dragFrame.current.classList.add(styles.dragEnter) }
                    }}
                    onDragLeave={() => {
                        counter.current--;

                        if (counter.current === 0) { removeDragStyle() }
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

                        counter.current = 0;
                        removeDragStyle()
                        processFile("drag", event)
                    }}
                    /* onClick={() => attachments.length > 0 } */
                    style={{
                        justifyContent: !hasFiles ? "center" : "flex-start",
                        alignItems: !hasFiles ? "center" : "flex-start",
                        padding: hasFiles ? `2.5rem 2.5rem 7.5rem 2.5rem` : `2.5rem`
                    }}
                >
                    {
                        !hasFiles &&
                        <div className={styles.guide} style={{ width: hasFiles ? "100%" : "fit-content" }}>
                            <div className={styles.beforeHover}>
                                {
                                    !hasFiles &&
                                    <>
                                        <h6>Arraste arquivos para cá</h6>
                                        <p>ou</p>
                                    </>
                                }
                                <label className={`${styles.searchFile} ${buttonStyles.button}`} htmlFor="attachmentUpload">{hasFiles ? "Adicionar arquivo" : "Escolher arquivo"}</label>
                            </div>
                            <div className={styles.afterHover}>
                                <span className={`material-symbols-rounded filled`}>
                                    upload_file
                                </span>
                                <h6>Solte para carregar</h6>
                            </div>
                        </div>
                    }
                    <ul>
                        {listItems}
                    </ul>
                    <label className={styles.picker} htmlFor="attachmentUpload" />
                    <input onChange={(event) => processFile('input', event)} type={"file"} name="" id="attachmentUpload" />
                    {
                        hasFiles && <div className={styles.tagsHolder}>
                            <div>
                                <span className="material-symbols-rounded">sell</span>
                                <p>Tags</p>
                            </div>
                            <AttachmentTag index={"1"} tagId={1} />
                            <AttachmentTag index={"2"} tagId={2} />
                            <AttachmentTag index={"3"} tagId={3} />
                            <AttachmentTag index={"4"} tagId={4} />
                        </div>
                    }
                </div>
                :
                <div className={`${styles.attachmentHolder} ${styles.expired}`}>
                    <span className={`${styles.icon} static material-symbols-rounded`}>
                        sentiment_dissatisfied
                    </span>
                    <div className="">
                        {
                            !hasGoogleAuthentication ?
                                <>
                                    <p>{`Eita!\nParece que o nosso acesso a sua conta Google expirou :(`}</p>
                                    <p>Para anexar arquivos novamente, entre novamente na plataforma para revalidar seus dados.</p>
                                </>
                                :
                                <>
                                    <p>{`Eita!\nTivemos um problema interno no servidor :(`}</p>
                                    <p>Por favor, tente reiniciar a página para resolver o erro.</p>
                                </>
                        }
                    </div>
                </div>
        }
    </div>
}