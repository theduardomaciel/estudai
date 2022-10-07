import styles from './modal.module.css';
import React, { SetStateAction } from 'react';

import { motion } from "framer-motion"

type Props = {
    isVisible: boolean;
    setIsVisible: (state: boolean) => SetStateAction<void>;
    actionFunction?: () => void;
    color: string;
    Icon: any;
    title: string;
    description: React.ReactNode;
    buttonText?: string;
    isLoading?: boolean;
    suppressReturnButton?: boolean;
    zIndex?: number;
}

import { AnimatePresence } from "framer-motion";
import Button from '../Button';

export default function DashboardModal({ isVisible, setIsVisible, actionFunction, color, isLoading, Icon, title, description, buttonText, suppressReturnButton, zIndex }: Props) {
    const backdropVariants = {
        open: {
            opacity: 1,
            transition: { ease: "easeOut", duration: 0.25 }
        },
        closed: {
            opacity: 0,
            transition: { ease: "easeOut", duration: 0.25 }
        }
    };

    return (
        <AnimatePresence /* exitBeforeEnter */>
            {
                isVisible && (
                    <motion.div
                        className={styles.background}
                        key="modal"
                        initial={"closed"}
                        animate={isVisible ? "open" : "closed"}
                        exit={"closed"}
                        variants={backdropVariants}
                        style={{ zIndex: zIndex }}
                    >
                        <div className={styles.container}>
                            <div style={{ backgroundColor: color }} className={styles.iconHolder}>
                                <span className={'material-symbols-rounded'} style={{ fontSize: "4.8rem", color: "var(--light" }}>{Icon}</span>
                            </div>

                            <h2>{title}</h2>
                            <p>{description}</p>

                            <div className={styles.buttonsHolder}>
                                {
                                    !suppressReturnButton && !isLoading &&
                                    <Button
                                        onClick={() => setIsVisible(!isVisible)}
                                        title={actionFunction ? `CANCELAR` : "RETORNAR"}
                                        icon={actionFunction ? 'close' : 'arrow_back'}
                                        style={{
                                            background: "var(--primary-02)",
                                            padding: `0.7rem 1.5rem`
                                        }}
                                    />
                                }
                                {
                                    actionFunction &&
                                    <Button
                                        onClick={actionFunction}
                                        title={buttonText}
                                        isLoading={isLoading}
                                        icon={Icon}
                                        iconColor={'var(--light)'}
                                        style={{
                                            background: color,
                                            padding: `0.7rem 1.5rem`
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}