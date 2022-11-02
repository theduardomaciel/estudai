import Image from "next/image";
import React from "react";

import { useAppContext } from "../../contexts/AppContext";

import styles from "./portraits.module.css"

interface Props {
    imagesUrls: Array<string>;
    position?: 'flex-start' | 'center' | 'flex-end';
    size?: number;
    maxLength?: number;
    onClick?: () => void;
}

const defaultSize = 22;

export default function UsersPortraits({ imagesUrls, maxLength: max, position, size, onClick }: Props) {
    const { viewMode } = useAppContext();

    const maxLength = max ? max : 5;

    const imagesArray = imagesUrls.length > maxLength ? imagesUrls.slice(1, maxLength) : imagesUrls;

    return <div
        className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : 'default' /* justifyContent: position ? position : 'flex-start' */ }}
    >
        {
            imagesArray.map((url, i) => {
                return <Image key={i} className={styles.image} src={url.replace('"', '')} width={size ? size : defaultSize} height={size ? size : defaultSize} alt="imagem de usuário" />
            })
        }
        {
            imagesUrls.length > maxLength &&
            <div className={styles.additionalUsers} style={{ width: size ? size : defaultSize, height: size ? size : defaultSize }}>
                +{imagesUrls.length - maxLength}
            </div>
        }
    </div>
}