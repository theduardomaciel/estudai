import React from "react";

import styles from "./note.module.css";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    tag?: string;
    description: { landscape: string, portrait: string };
    showOnlyInMobile?: boolean;
    showOnlyInDesktop?: boolean;
}

export default function Note({ tag, description, showOnlyInDesktop, showOnlyInMobile, ...rest }: Props) {
    return <div className={`${styles.container} ${showOnlyInMobile ? styles.mobile : showOnlyInDesktop ? styles.desktop : ""}`}>
        <div className={styles.tagHolder}>
            <p className={styles.tag}>{tag}</p>
        </div>
        {
            description.landscape && <p className={styles.landscape}>{description.landscape}</p>
        }
        {
            description.portrait && <p className={styles.portrait}>{description.portrait}</p>
        }
    </div>
}