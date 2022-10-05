import React, { Dispatch, SetStateAction } from "react"

// Drag 'n drop
import { useMultiDrop } from 'react-dnd-multi-backend'
import { useScreenSize } from "../../../hooks/useScreenSize";

// Types
import { Attachment } from "../../../types/Attachment";
import { getTagInfo } from "../../../utils/getTagInfo";
import { Tag, TagProps } from "../Tag";

// Stylesheets
import styles from "./styles.module.css";

// Icons
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";

type Props = React.LiHTMLAttributes<HTMLLIElement> & {
    attachments: Attachment[];
    setAttachments: Dispatch<SetStateAction<Attachment[]>>;
    file: Attachment;
    index: number;
};

export default function File({ attachments, setAttachments, index, file, ...rest }: Props) {
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

    return (
        <li
            key={index}
            className={`${styles.attachment} ${isHovered ? styles.hovered : ""}`} ref={isScreenWide ? html5Drop : touchDrop}
        >
            <div className={styles.header}>
                {
                    file.type === "doc" ?
                        <DocAttachment className={styles.icon} />
                        :
                        <PDFAttachment className={styles.icon} />
                }
                <span className={`material-symbols-rounded ${styles.close}`} onClick={() => {
                    let array = [...attachments]; // make a separate copy of the array
                    const arrayIndex = index;
                    console.log(arrayIndex, index, array)
                    if (arrayIndex !== -1) {
                        array.splice(arrayIndex, 1);
                        setAttachments(array)
                        console.log("Anexo removido com sucesso!")
                    }
                }}>
                    close
                </span>
            </div>
            <p className={styles.fileName}>{file.name}</p>
            <div className={styles.classes}>
                {
                    attachments[index].tags && attachments[index].tags.length > 0 &&
                    <ul key={'tagsList'}>
                        {attachments[index].tags.map((tag, tagIndex) => {
                            //console.log(tag, attachments[index].tags)
                            return <Tag key={tagIndex} tagId={tag} index={tagIndex} style={{ cursor: "pointer" }} tagType={"placed_card"} onClick={(event) => onTagClick(event, tagIndex)} />
                        })}
                    </ul>
                }
                {
                    isHovered &&
                    <Tag index={index} tagId={tagObject.tagId} style={{ opacity: 0.25 }} />
                }
            </div>
        </li>
    );
}