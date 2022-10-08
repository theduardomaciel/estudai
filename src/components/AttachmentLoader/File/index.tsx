import { AxiosError } from "axios";
import { parseCookies } from "nookies";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

// Drag 'n drop
import { useMultiDrop } from 'react-dnd-multi-backend'
import { useScreenSize } from "../../../hooks/useScreenSize";
import { api } from "../../../lib/api";

// Types
import { Attachment } from "../../../types/Attachment";
import { Tag, TagProps } from "../Tag";

// Stylesheets
import styles from "./styles.module.css";

// Icons
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";

function divideFileInChunks(fileData: File) {
    const fileChunks = [];
    const maxBlob = 256 * 10 * 1024; // each chunk size (2.5MB)
    let offset = 0;
    while (offset < fileData.size) {
        const chunkSize = Math.min(maxBlob, fileData.size - offset);
        fileChunks.push({
            blob: fileData.slice(offset, (offset + chunkSize)),
            start: offset,
            end: offset + chunkSize,
        })
        offset += chunkSize;
    }
    return fileChunks;
}

export async function uploadFile(fileData: File) {
    const meta = {
        name: fileData.name,
        mimeType: fileData.type,
    };

    const fileChunks = divideFileInChunks(fileData); // divide the file into chunks

    async function uploadChunks(googleSessionUrl: string, length: string) {
        for (let i = 0; i < fileChunks.length; i += 1) {
            const formData = new FormData();

            formData.append('blob', fileChunks[i].blob/* , 'blobChunk' */);
            formData.append('start', fileChunks[i].start.toString());
            formData.append('end', fileChunks[i].end.toString());
            formData.append('sessionUrl', googleSessionUrl);
            formData.append('length', length);

            console.log("Enviando chunk...", formData)

            const chunkUpload = await api.post(`/upload/sendChunksToDrive`, formData, {
                headers: {
                    'Content-type': 'multipart/form-data; boundary=XXX'
                }
            })

            if (chunkUpload.status === 200) {
                console.log(`${i + 1} Chunk Uploaded of ${fileChunks.length}`);
            } else if (chunkUpload.status === 201) {
                console.log("Upload concluído.")
                return chunkUpload.data;
            }
        }
    }

    try {
        const response = await api.post(`/upload/getGoogleSessionUrl`, JSON.stringify({ meta }), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log("Google Session Data URL: ", response.data)
        if (response.data) {
            const result = await uploadChunks(response.data, fileData.size.toString())
            console.warn(result, "Arquivo enviado para o Drive com sucesso!")
        }
    } catch (err: any) {
        const error = err as AxiosError;
        console.log(error)
        if (error.response?.status === 401) {
            return "google_error";
        } else {
            return "server_error"
        }
    }
}

type Props = React.LiHTMLAttributes<HTMLLIElement> & {
    attachments: Attachment[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
    attachment: Attachment;
    index: number;
};

export default function File({ attachment, attachments, setAttachments, index, ...rest }: Props) {
    const [[dropProps], { html5: [html5DropProps, html5Drop], touch: [touchDropProps, touchDrop] }] = useMultiDrop({
        accept: 'card',
        drop: (item: TagProps) => {
            const alreadyHasTag = attachments[index].tags.filter((value, index) => { return value === item.tagId }).length > 0
            console.log(alreadyHasTag)
            if (!alreadyHasTag) {
                console.log(item)
                let array = [...attachments];
                const oldTags = array[index].tags;

                array[index].tags = oldTags.concat(item.tagId)

                setAttachments(array)
                console.log("Tag adicionada com sucesso!")
            }
        },
        collect: (monitor) => {
            return {
                hoverObject: monitor.getItem(),
                isActive: monitor.canDrop() && monitor.isOver(),
            }
        },
    })

    const { isScreenWide } = useScreenSize();

    const tagObject = html5DropProps.hoverObject || touchDropProps.hoverObject;
    const isHovered = html5DropProps.isActive || touchDropProps.isActive;

    const onTagClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, tagIndex: number) => {
        let array = [...attachments];
        array[index].tags.splice(tagIndex, 1);
        setAttachments(array)

        console.log(event.currentTarget)
        /* event.currentTarget.remove() */

        console.log("Tag removida com sucesso!")
    }

    const [progress, setProgress] = useState(0)

    return (
        <li
            key={index}
            className={`${styles.attachment} ${isHovered ? styles.hovered : ""}`} ref={isScreenWide ? html5Drop : touchDrop}
        >
            <div className={styles.header}>
                {
                    attachment.type === "doc" ?
                        <DocAttachment className={styles.icon} />
                        :
                        <PDFAttachment className={styles.icon} />
                }
                <span className={`material-symbols-rounded ${styles.close}`} onClick={() => {
                    let array = [...attachments]; // make a separate copy of the array
                    const arrayIndex = index;
                    if (arrayIndex !== -1) {
                        array.splice(arrayIndex, 1);
                        setAttachments(array)
                        console.log(`Anexo ${index} removido com sucesso.`)
                    }
                }}>
                    close
                </span>
            </div>
            <p className={styles.fileName}>{attachment.name}</p>
            <div className={styles.progressBar}>
                <div style={{ width: `${progress}%` }} />
                <div />
            </div>
            <div className={styles.classes}>
                <ul key={'tagsList'}>
                    {
                        attachments[index].tags && attachments[index].tags.length > 0 &&
                        attachments[index].tags.map((tag, tagIndex) => {
                            //console.log(tag, attachments[index].tags)
                            return <Tag key={tagIndex} tagId={tag} index={tagIndex} style={{ cursor: "pointer" }} tagType={"placed_card"} onClick={(event) => onTagClick(event, tagIndex)} />
                        })
                    }
                    {
                        isHovered &&
                        <Tag index={index} tagId={tagObject.tagId} style={{ opacity: 0.25 }} />
                    }
                </ul>
            </div>
        </li>
    );
}