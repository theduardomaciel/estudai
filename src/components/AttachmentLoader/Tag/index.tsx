import React, { RefObject } from "react"

// Drag 'n drop
import { useMultiDrag } from 'react-dnd-multi-backend'
import useScreenSize from "../../../hooks/useScreenSize";
import { getTagInfo } from "../../../utils/getTagInfo";

// Stylesheets
import styles from "./styles.module.css";

export interface TagProps {
    index: number | string;
    tagId: number;
    tagType?: 'card' | 'placed_card';
}

type Props = React.LiHTMLAttributes<HTMLLIElement> & TagProps;

export const Tag = React.forwardRef(({ index, tagId, tagType, ...rest }: Props, ref) => {
    const typedRef = ref as RefObject<HTMLLIElement>;
    const [name, icon] = getTagInfo(tagId);

    return <li key={index} className={styles.tag} ref={typedRef} {...rest} >
        <span className="material-symbols-rounded">{icon}</span>
        <p>{name}</p>
    </li>
});

export default function AttachmentTag({ tagId, index, tagType }: Props) {
    const [[dragProps], { html5: [html5Props, html5Drag], touch: [touchProps, touchDrag] }] = useMultiDrag({
        type: tagType ? tagType : 'card',
        item: { tagId: tagId, index: index },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
            }
        },
    });

    const { isScreenWide } = useScreenSize();

    return (
        <Tag
            tagId={tagId}
            index={index}
            ref={isScreenWide ? html5Drag : touchDrag}
            style={html5Props.isDragging || touchProps.isDragging ? { border: `0.5px dashed var(--light)`, opacity: 0.5 } : { border: `1px solid var(--primary-02)`, opacity: 1 }}
        />
    )
}