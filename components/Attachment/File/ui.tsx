"use client";

import React from "react";

// Stylesheets
import styles from "../styles.module.css";

// Icons
import DocAttachment from "/public/icons/attachment/doc.svg";
import PDFAttachment from "/public/icons/attachment/pdf.svg";
import ImgAttachment from "/public/icons/attachment/img.svg";

interface Props extends React.HTMLProps<HTMLLIElement> {
    name: string;
    fileType?: "pdf" | "img" | "doc";
    tags?: string[];
    isHovered?: boolean;
    children?: React.ReactNode;
    headerChildren?: React.ReactNode;
}

export default function FileUI({
    name,
    fileType = "doc",
    isHovered,
    children,
    headerChildren,
    ...rest
}: Props) {
    return (
        <li
            className={`${styles.attachment} ${
                isHovered ? styles.hovered : ""
            }`}
            {...rest}
        >
            <div className={styles.header}>
                {fileType === "pdf" ? (
                    <PDFAttachment className={styles.icon} />
                ) : fileType === "img" ? (
                    <ImgAttachment className={styles.icon} />
                ) : (
                    <DocAttachment className={styles.icon} />
                )}
                {headerChildren}
            </div>
            <p className={styles.fileName}>{name}</p>
        </li>
    );
}
