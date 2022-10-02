import { styled } from "@stitches/react";
import React from "react";
import { useScreenSize } from "../../../hooks/useScreenSize";

import styles from "./note.module.css";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    tag?: string;
    description: string;
    showOnlyInMobile?: boolean;
    showOnlyInDesktop?: boolean;
}

const ALPHA_MESSAGE = "Este projeto ainda está em andamento, portanto, espere bugs e outros problemas."
const REDUCED_ALPHA_MESSAGE = "Este projeto ainda está em andamento."

export default function Note({ tag, description, showOnlyInDesktop, showOnlyInMobile, ...rest }: Props) {
    const { isScreenWide } = useScreenSize();

    return <div className={`${styles.container} ${showOnlyInMobile ? styles.mobile : showOnlyInDesktop ? styles.desktop : ""}`} {...rest}>
        <div className={styles.tagHolder}>
            <p className={styles.tag}>{tag}</p>
        </div>
        <p>{isScreenWide ? ALPHA_MESSAGE : REDUCED_ALPHA_MESSAGE}</p>
    </div>
}