import Image from "next/image";
import React from "react";

import { useAppContext } from "../../contexts/AppContext";

import styles from "./portraits.module.css"

interface Props {
    imagesUrls: Array<string>;
    position?: 'flex-start' | 'center' | 'flex-end';
}

export default function UsersPortraits({ imagesUrls, position }: Props) {
    const { viewMode } = useAppContext();

    const imagesArray = imagesUrls.length > 5 ? imagesUrls.slice(1, 5) : imagesUrls;

    return <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`} /* style={{ justifyContent: position ? position : 'flex-start' }} */>
        {
            imagesArray.map((url, i) => {
                return <Image key={i} className={styles.image} src={url.replace('"', '')} width={22} height={22} alt="imagem de usuário" />
            })
        }
    </div>
}