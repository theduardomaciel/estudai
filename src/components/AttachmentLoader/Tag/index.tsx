/* import React, { Dispatch, SetStateAction } from "react"

// Drag 'n drop
import { useMultiDrag } from 'react-dnd-multi-backend'

// Stylesheets
import styles from "./styles.module.css";

const CardTypes = {
    CARD: 'card'
}

interface Props {
    icon: string | any;
    name: string;
    index: string;
}

export default function AttachmentTag({ icon, name, index }: Props) {
    const [[dragProps], { html5: [html5Props, html5Drag], touch: [touchProps, touchDrag] }] = useMultiDrag({
        type: 'card',
        item: { color: "red" },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
            }
        },
    })

    return (
        <>
            <li key={index} className={styles.tag} ref={html5Drag}>
                <span className="material-symbols-rounded">{icon}</span>
                <p>{name}</p>
            </li>
            <li key={index + 1} className={styles.tag} ref={touchDrag}>
                <span className="material-symbols-rounded">{icon}</span>
                <p>{name}</p>
            </li>
        </>
    );
} */

import React, { Dispatch, SetStateAction } from "react"

// Drag 'n drop
import { useMultiDrag } from 'react-dnd-multi-backend'

// Stylesheets
import styles from "./styles.module.css";

interface Props {
    icon: string | any;
    name: string;
    index: string;
}

export default function AttachmentTag({ icon, name, index }: Props) {
    const [[dragProps], { html5: [html5Props, html5Drag], touch: [touchProps, touchDrag] }] = useMultiDrag({
        type: 'card',
        item: { color: 'red' },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
            }
        },
    })

    const containerStyle = { opacity: dragProps.isDragging ? 0.5 : 1 }
    const html5DragStyle = { backgroundColor: 'red', opacity: html5Props.isDragging ? 0.5 : 1 }
    const touchDragStyle = { backgroundColor: 'red', opacity: touchProps.isDragging ? 0.5 : 1 }
    return (
        <div style={containerStyle}>
            {/* <div style={html5DragStyle} ref={html5Drag}>HTML5</div> */}
            <div style={touchDragStyle} ref={touchDrag}>Touch</div>
        </div>
    )
}