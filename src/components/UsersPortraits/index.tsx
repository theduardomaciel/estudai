import React from "react";

import styles from "./portraits.module.css"

interface Props {
    imagesUrls: Array<string>;
}

export default function UsersPortraits(props: Props) {
    return <ul className={styles.container}>
        {
            props.imagesUrls.map((url, index) =>
                <li key={index}>
                    <img className={styles.image} src={url} alt="imagem de usuário" />
                </li>
            )
        }
    </ul>
}