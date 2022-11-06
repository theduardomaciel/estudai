import Image from "next/image";
import { useRouter } from "next/router";

// Imports
import styles from "./styles.module.css"

// Components
import Button from "../Button";
import { Dispatch, SetStateAction, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
    url: string | undefined;
    setUrl: Dispatch<SetStateAction<string | undefined>>;
}

export default function AttachmentPreview({ url, setUrl }: Props) {
    const backdropRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!backdropRef.current?.contains(event.nativeEvent.target as Node)) {
            setUrl(undefined)
        };
    }

    return (
        <AnimatePresence mode='wait'>
            {
                url &&
                <motion.div
                    className={styles.container}
                    onClick={handleClick}
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <iframe className={styles.content} src={`https://docs.google.com/viewer?srcid=${url}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`}></iframe>
                </motion.div>
            }
        </AnimatePresence>
    )
}