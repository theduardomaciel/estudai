import React from "react";
import { useAppContext } from "../../contexts/AppContext";

import styles from "./portraits.module.css"

interface Props {
    imagesUrls: Array<string>;
}

export default function UsersPortraits(props: Props) {
    const { viewMode } = useAppContext();

    return <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}>
        {
            props.imagesUrls.map((url, index) =>
                <img key={index} className={styles.image} src={url} alt="imagem de usuário" />
            )
        }
    </div>
}