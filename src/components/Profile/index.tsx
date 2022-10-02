import Image from 'next/image'
import { useState } from 'react'
import { User } from '../../types/User';
import Button from '../Button'

import styles from './profile.module.css'

interface Props {
    onClick?: () => void;
    user?: User;
}

export default function Profile(props: Props) {

    function getGreetings() {
        const now = new Date();
        const actualHour = now.getHours()

        if (actualHour > 4 && actualHour <= 11) {
            return "Bom dia,"
        } else if (now.getHours() > 11 && actualHour <= 18) {
            return "Boa tarde,"
        } else if (now.getHours() > 18) {
            return "Boa noite,"
        } else {
            return "Bem vindo,"
        }
    }

    return (
        <div className={styles.holder}>
            <div className={styles.profile}>
                {/* <div > */}
                <img className={styles.image} src={props.user?.image_url} />
                {/* </div> */}

                <div className={styles.text}>
                    <p>{getGreetings()}</p>
                    <p>{`${props.user?.firstName} ${props.user?.lastName}`}</p>
                </div>
            </div>
            <div className={styles.row2}>
                <div className={styles.pendingReminder}>
                    <span className="material-symbols-rounded">notifications_active</span>
                    <p>Você tem <span> 6 atividades </span> pendentes.</p>
                    <div className={styles.progressHolder}>
                        <p>61%</p>
                        <div className={styles.progressBar}>
                            <div />
                            <div />
                        </div>
                    </div>
                </div>
                <Button classes={styles.openMenu} onClick={props.onClick} icon={"menu"} />
            </div>
        </div>
    )
}