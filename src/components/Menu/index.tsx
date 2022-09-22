import React from 'react'
import styles from './menu.module.css'

interface Props {
    children: React.ReactNode;
}

export default function Menu({ children }: Props) {
    return (
        <div className={styles.holder}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}