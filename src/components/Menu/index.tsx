import React from 'react'
import styles from './menu.module.css'

interface Props {
    children: React.ReactNode;
    isOpened?: boolean;
}

export default function Menu({ children, isOpened }: Props) {
    return (
        <div className={`${isOpened && styles.open} ${styles.holder}`}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}