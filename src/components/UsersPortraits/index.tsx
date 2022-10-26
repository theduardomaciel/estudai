import React from "react";
import { useAppContext } from "../../contexts/AppContext";

import styles from "./portraits.module.css"

interface Props {
    imagesUrls: Array<string>;
}

export default function UsersPortraits({ imagesUrls }: Props) {
    const { viewMode } = useAppContext();

    const imagesArray = imagesUrls.length > 5 ? imagesUrls.slice(1, 5) : imagesUrls;

    return <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}>
        {
            imagesArray.map((url, i) => {
                return <img key={i} className={styles.image} src={url.replace('"', '')} alt="imagem de usuário" />
            })
        }
    </div>
}