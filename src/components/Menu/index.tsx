import React, { useState, useMemo } from 'react'
import { useAppContext } from '../../contexts/AppContext';

// Components
import Button from '../Button';
import Calendar from '../Calendar';
import Focus from '../Focus';

// Stylesheets
import styles from './menu.module.css'

interface Props {
    children?: React.ReactNode;
    flex?: boolean;
}

export default function Menu({ children, flex }: Props) {
    const { isMenuOpened, toggleMenu } = useAppContext();

    const focus = useMemo(() => <Focus />, [])

    return children ?
        <div className={`${isMenuOpened || flex && styles.open} ${flex && styles.flex} ${styles.holder}`}>
            <div className={styles.content}>
                {children}
            </div>
        </div> :
        <div className={`${isMenuOpened || flex && styles.open} ${flex && styles.flex} ${styles.holder}`}>
            <div className={styles.content}>
                <div className={styles.menuHeader}>
                    <div className='row'>
                        <h3>Agenda</h3>
                        <Button classes={styles.closeButton} icon={'close'} onClick={toggleMenu} style={{ height: "3rem", width: "3rem", padding: 0 }} />
                    </div>
                    <Calendar linkToCreate />

                    {/* <div className={styles.eventHolder} >
                        <h6>Próximo evento importante</h6>
                        <div className={styles.card}>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardColumn}>
                                <p style={{ textTransform: "uppercase" }}>AV1 | 3º BIMESTRE</p>
                                <h5>Matemática e Natureza</h5>
                            </div>
                            <div className={styles.cardColumn} style={{ alignItems: "flex-end" }}>
                                <div className='row' style={{ gap: "0.25rem", width: "fit-content" }}>
                                    <span style={{ fontSize: "1.2rem" }} className={`material-symbols-rounded`}>calendar_today</span>
                                    <p>29/02</p>
                                </div>
                                <p style={{ textAlign: "end" }}>90 questões</p>
                            </div>
                        </div>
                    </div> */}

                </div>
                {focus}
            </div>
        </div>
}