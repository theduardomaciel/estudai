import React from 'react'
import styles from './menu.module.css'

interface Props {
    children: React.ReactNode;
    isOpened?: boolean;
    flex?: boolean;
}

export default function Menu({ children, isOpened, flex }: Props) {
    return (
        <div className={`${isOpened && styles.open} ${flex && styles.flex} ${styles.holder}`}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}