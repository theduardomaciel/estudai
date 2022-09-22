import Image from 'next/image'
import { useState } from 'react'
import Button from '../Button'

import styles from './profile.module.css'

interface Props {
    onClick?: () => void;
}

export default function Profile(props: Props) {
    return (
        <div className={styles.holder}>
            <div className={styles.profile}>
                {/* <div > */}
                <img className={styles.image} src={"https://github.com/theduardomaciel.png"} />
                {/* </div> */}

                <div className={styles.text}>
                    <p>Bom dia,</p>
                    <p>Fulano da Silva</p>
                </div>
            </div>
            <div className={styles.row2}>
                <div className={styles.pendingReminder}>
                    <Image src="/icons/notification.svg" height={24} width={24} />
                    <p>Você tem <span> 6 atividades </span> pendentes.</p>
                    <div className={styles.progressHolder}>
                        <p>61%</p>
                        <div className={styles.progressBar}>
                            <div />
                            <div />
                        </div>
                    </div>
                </div>
                <Button classes={styles.openMenu} onClick={props.onClick}>
                    <Image src="/icons/menu.svg" height={24} width={24} />
                </Button>
            </div>
        </div>
    )
}