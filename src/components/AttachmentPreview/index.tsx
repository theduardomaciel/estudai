import Image from "next/image";
import { useRouter } from "next/router";

// Imports
import styles from "./styles.module.css"

// Components
import Button from "../Button";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../Spinner";

type Props = {
    url: string | undefined;
    setUrl: Dispatch<SetStateAction<string | undefined>>;
}

export default function AttachmentPreview({ url, setUrl }: Props) {
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setLoading] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (backdropRef.current?.contains(event.nativeEvent.target as Node)) {
            setUrl(undefined)
            setLoading(true)
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
                    ref={backdropRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <div className={styles.content}>
                        <iframe className={styles.frame} src={`https://docs.google.com/viewer?srcid=${url}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`} onLoad={() => setLoading(false)} allowTransparency></iframe>
                        <div className={`${styles.loadingFrame} ${isLoading ? styles.loading : ""}`}>
                            <Spinner color="var(--primary-02)" />
                            <p>Carregando visualização...</p>
                        </div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}