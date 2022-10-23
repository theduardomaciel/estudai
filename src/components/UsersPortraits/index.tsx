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
            props.imagesUrls.slice(1, 5).map((url, index) => {
                return < img key={index} className={styles.image} src={url.replace('"', '')} alt="imagem de usuário" />
            })
        }
    </div>
}