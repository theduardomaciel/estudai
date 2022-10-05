import React, { Dispatch, SetStateAction } from "react"

// Drag 'n drop
import { useMultiDrop } from 'react-dnd-multi-backend'
import { useScreenSize } from "../../../hooks/useScreenSize";

// Types
import { Attachment } from "../../../types/Attachment";
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

const TagsNames = ['Lista de Questões', 'Material Teórico', 'Slides', 'Resumos', 'Imagens']
const TagsIcons = ['print', 'description', 'media_link', 'history_edu', 'wallpaper']

export default function File({ attachments, setAttachments, index, file, ...rest }: Props) {
    const [[dropProps], { html5: [html5DropProps, html5Drop], touch: [touchDropProps, touchDrop] }] = useMultiDrop({
        accept: 'card',
        drop: (item: TagProps) => {
            const message = `Dropped: ${item.name} on file of index ${index}`
            console.log(message)
        },
        /* hover(item, monitor) {
            //const card = document.getElementById(`card_${index}`)
            const draggedIndex = item.index;
            const targetIndex = index;
            console.log(draggedIndex, targetIndex)
        }, */
        hover(item, monitor) {
            let array = [...attachments]; // make a separate copy of the array
            const oldTags = array[index].tags;;
            array[index].tags = oldTags.concat(item)
            setAttachments(array)
            console.log("Tag adicionada com sucesso!")
        },
        collect: (monitor) => {
            return {
                isActive: monitor.canDrop() && monitor.isOver(),
            }
        },
    })

    const { isScreenWide } = useScreenSize();

    const listItems = attachments[index].tags.map((tag, index) => {
        const icon = TagsIcons[tag]
        const name = TagsNames[tag]
        return <Tag key={index} name={name} icon={icon} index={index} />
    });

    return (
        <li
            key={index}
            className={`${styles.attachment} ${html5DropProps.isActive || touchDropProps.isActive ? styles.hovered : ""}`} ref={isScreenWide ? html5Drop : touchDrop}
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
            <p>{file.name}</p>
            <div className={styles.classes}>
                <ul key={'tagsList'}>
                    {listItems}
                </ul>
            </div>
        </li>
    );
}