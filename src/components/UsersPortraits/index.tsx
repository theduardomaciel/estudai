import React from "react";

import styles from "./portraits.module.css"

interface Props {
    imagesUrls: Array<string>;
}

export default function UsersPortraits(props: Props) {
    return <div className={styles.container}>
        {
            props.imagesUrls.map((url, index) =>
                <img key={index} className={styles.image} src={url} alt="imagem de usuário" />
            )
        }
    </div>
}