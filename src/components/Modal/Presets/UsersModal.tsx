import Image from 'next/image';
import React, { useState } from 'react';

import styles from "../preset.module.css";

import Modal from '..';

import { User } from '../../../types/User';
import formatDate from '../../../utils/formatDate';
import Translate, { TranslateText } from '../../Translate';

interface ModalProps {
    icon?: string;
    name?: string;
    users: User[];
    dates?: string[] | Date[] | number[];
}

export default function UsersModalPreset(defaultProps?: ModalProps) {
    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalProps, setModalProps] = useState<ModalProps | undefined>(defaultProps ? defaultProps : undefined)

    return {
        UsersModal: <Modal
            isVisible={isModalVisible !== false}
            toggleVisibility={() => setModalVisible(false)}
            icon={modalProps?.icon ? modalProps.icon : 'check'}
            suppressReturnButton
            iconProps={{ position: "flex-start", builtWithTitle: true, size: "2.8rem" }}
            color={`var(--primary-02)`}
        >
            <div className={styles.usersContainer}>
                <header>
                    <div className={'iconHolder'}>
                        <span className="material-symbols-rounded static">person</span>
                        <p>{modalProps?.name ? TranslateText(modalProps.name) : TranslateText("User")}</p>
                    </div>
                    {
                        modalProps?.dates &&
                        <div className={'iconHolder'}>
                            <span className="material-symbols-rounded static">calendar_today</span>
                            <p><Translate>Date</Translate></p>
                        </div>
                    }
                </header>
                {
                    modalProps?.users && modalProps.users.map((user, index) => <li key={index} className={styles.user}>
                        <div className={'iconHolder'} style={{ gap: "1rem" }}>
                            <Image src={user.image_url} alt={'User avatar'} width={22} height={22} style={{ borderRadius: "50%" }} />
                            <p style={{ width: "fit-content" }}>{`${user.firstName} ${user.lastName}`}</p>
                        </div>

                        {
                            modalProps?.dates &&
                            <p>{formatDate(modalProps.dates[index] as number)}</p>
                        }
                    </li>)
                }
            </div>
        </Modal>,
        setUsersModalVisible: setModalVisible,
        setUsersModalProps: setModalProps
    }
}