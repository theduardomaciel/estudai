"use client";

import React from "react";

// Stylesheets
import styles from "../styles.module.css";

// Icons
import LinkIcon from "@material-symbols/svg-600/rounded/link.svg";
import { cn } from "@/lib/ui";

interface Props extends React.HTMLProps<HTMLLIElement> {
    url: string;
    headerChildren?: React.ReactNode;
}

export default function LinkUI({
    url,
    className,
    headerChildren,
    ...rest
}: Props) {
    return (
        <li className={cn(styles.attachment, className)} {...rest}>
            <div className={styles.header}>
                <LinkIcon className="icon text-4xl text-primary-02" />
                {headerChildren}
            </div>
            <a
                href={url}
                target={"_blank"}
                rel="noreferrer"
                className={`${styles.fileName} underline cursor-pointer`}
            >
                {url}
            </a>
        </li>
    );
}
