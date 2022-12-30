import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

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
import LinkAttachment from "./Link";
import Modal from "../Modal";
import Input from "../Input";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";
import Translate, { TranslateText } from "../Translate";

type Props = React.StyleHTMLAttributes<HTMLInputElement> & {
    attachments: any[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
    links: string[];
    setLinks: Dispatch<SetStateAction<string[]>>;
    /* attachments: MutableRefObject<Attachment[]>; */
};

function isValidUrl(str: string) {
    const pattern = new RegExp(
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );
    return pattern.test(str);
}

export default function AttachmentsLoader({ attachments, setAttachments, links, setLinks, ...rest }: Props) {
    const dragFrame = useRef<HTMLDivElement | null>(null);

    const counter = useRef<number>(0);
    const { hasGoogleAuthentication } = useAppContext();

    const [isLinksModalVisible, setLinksModalVisible] = useState(false);
    const linkInputValue = useRef("");

    const removeDragStyle = () => {
        if (dragFrame.current) {
            dragFrame.current.classList.remove(styles.dragEnter)
        }
    }

    const linksItems = links.map((link, index) => {
        return <LinkAttachment key={index} link={link} index={index} links={links} setLinks={setLinks} />
    })

    const hasFiles = attachments.length !== 0;
    const hasLinks = links.length !== 0;

    const listItems = attachments.map((attach, index) => {
        return <File key={`card_${index}`} attachmentIndex={index} attachments={attachments} setAttachments={setAttachments} />
    }).concat(linksItems);

    const preAttachments = useRef<Array<any>>([]);

    async function formatNewFile(file: File) {
        console.log(file, 'Iniciando processo de upload do arquivo.')

        const preAttachment = {
            name: file.name,
            type: file.type,
            tags: [],
            viewLink: "",
            downloadLink: "",
            fileId: file,
        };

        preAttachments.current.push(preAttachment)
    }

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
                            await formatNewFile(file)
                        }

                        // Agora que todos os attachments foram pré-carregados, iniciamos o processo de upload
                        if (i === items.length - 1) {
                            console.log(preAttachments.current.length)
                            setAttachments(preAttachments.current)
                        }
                    }
                });
            }
        } else if (type === "input") {
            const event = triggerEvent as React.ChangeEvent<HTMLInputElement>;
            const files = event.currentTarget.files as FileList;

            if (files) {
                Array.from(files).forEach((file, i) => {
                    formatNewFile(file)

                    console.log(i, files.length)
                    // Agora que todos os attachments foram pré-carregados, iniciamos o processo de upload
                    if (i === files.length - 1) {
                        console.log(preAttachments.current.length)
                        setAttachments(preAttachments.current)
                    }
                })
            }
        }
    }

    const { setHorizontalScroll } = useHorizontalScroll()

    const TagsPanel = () => {
        useEffect(() => {
            setHorizontalScroll("tagsScroll")
        }, [])

        return <div id="tagsScroll" className={styles.tagsHolder}>
            <div>
                <span className="material-icons-rounded">sell</span>
                <p>Tags</p>
            </div>
            <AttachmentTag index={"1"} tagId={1} />
            <AttachmentTag index={"2"} tagId={2} />
            <AttachmentTag index={"3"} tagId={3} />
            <AttachmentTag index={"4"} tagId={4} />
        </div>
    }

    return <div className={createTaskStyles.column} {...rest}>
        <div className='header'>
            <Section title={TranslateText("Attachments")} />
            <Button
                style={{ backgroundColor: "var(--primary-02)", padding: "0.5rem 1rem", border: "1px solid var(--primary-04)" }}
                icon={"link"}
                title={`${TranslateText("Add")} ${TranslateText("link")}`}
                onClick={() => setLinksModalVisible(true)}
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
                        !hasFiles && !hasLinks &&
                        <div className={styles.guide} style={{ width: hasFiles ? "100%" : "fit-content" }}>
                            <div className={styles.beforeHover}>
                                {
                                    !hasFiles &&
                                    <>
                                        <h6><Translate>Drag files here</Translate></h6>
                                        <p><Translate>or</Translate></p>
                                    </>
                                }
                                <label className={`${styles.searchFile} ${buttonStyles.button}`} htmlFor="attachmentUpload">{hasFiles ? `${TranslateText("Add")} ${TranslateText("file")}` : `${TranslateText("Choose")} ${TranslateText("file")}`}</label>
                            </div>
                            <div className={styles.afterHover}>
                                <span className={`material-symbols-rounded filled`}>
                                    upload_file
                                </span>
                                <h6><Translate>Drop to upload</Translate></h6>
                            </div>
                        </div>
                    }
                    <ul>
                        {listItems}
                    </ul>
                    <label className={styles.picker} htmlFor="attachmentUpload" />
                    <input onChange={(event) => processFile('input', event)} type={"file"} name="" id="attachmentUpload" multiple />
                    {
                        hasFiles && <TagsPanel />
                    }
                </div>
                :
                <div className={`${styles.attachmentHolder} ${styles.expired}`}>
                    <span className={`${styles.icon} static material-icons-rounded`}>
                        sentiment_dissatisfied
                    </span>
                    <div className="">
                        {
                            !hasGoogleAuthentication ?
                                <>
                                    <p>{TranslateText("Jeez!\Looks like our access to your Google account has expired :(")}</p>
                                    <p><Translate>To attach files again, enter the platform again to revalidate your data.</Translate></p>
                                </>
                                :
                                <>
                                    <p>{`${TranslateText("It looks like we had an internal server problem.")} :(`}</p>
                                    <p><Translate>Please try restarting the page to resolve the error.</Translate></p>
                                </>
                        }
                    </div>
                </div>
        }
        <Modal
            isVisible={isLinksModalVisible}
            color={`var(--primary-02)`}
            icon={'link'}
            toggleVisibility={() => setLinksModalVisible(!isLinksModalVisible)}
            title={`${TranslateText("Insert the link below")}:`}
            actionProps={{
                buttonText: TranslateText("ADD"),
                function: () => {
                    if (linkInputValue.current.length > 10 && isValidUrl(linkInputValue.current)) {
                        setLinks(links.concat(linkInputValue.current))
                        linkInputValue.current = ""
                        setLinksModalVisible(false)
                    }
                }
            }}
        >
            <Input
                onChange={(event) => linkInputValue.current = event.currentTarget.value}
                type={"url"}
                width={"100%"}
                height={"5rem"}
            />
        </Modal>
    </div>
}