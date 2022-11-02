import Image from 'next/image';
import React, { useState } from 'react';

import styles from "./styles.module.css";

import Modal from '..';

import { User } from '../../../types/User';

export default function UsersModalPreset() {
    const [isModalVisible, setModalVisible] = useState<boolean | User[]>(false)

    return {
        UsersModal: <Modal
            isVisible={isModalVisible !== false}
            toggleVisibility={() => setModalVisible(false)}
            icon={'check'}
            iconProps={{ position: "flex-start", builtWithTitle: true, size: "2.8rem" }}
            color={`var(--primary-02)`}
        >
            <div className={styles.usersContainer}>
                <header>
                    <div className={'iconHolder'}>
                        <span className="material-symbols-rounded static">person</span>
                        <p>Usuário</p>
                    </div>
                    {/* <div className={'iconHolder'}>
                    <span className="material-symbols-rounded static">calendar_today</span>
                    <p>Data</p>
                </div> */}
                </header>
                {
                    typeof isModalVisible !== "boolean" && isModalVisible.map((user, index) => <li key={index} className={styles.user}>
                        <div className={'iconHolder'} style={{ gap: "1rem" }}>
                            <Image src={user.image_url} alt={'User avatar'} width={22} height={22} style={{ borderRadius: "50%" }} />
                            <p style={{ width: "fit-content" }}>{`${user.firstName} ${user.lastName}`}</p>
                        </div>

                        {/* <p>---</p> */}
                    </li>)
                }
            </div>
        </Modal>,
        setUsersModalVisible: setModalVisible
    }
}