import styles from './modal.module.css';
import React, { SetStateAction } from 'react';

import { motion } from "framer-motion"

type Props = {
    isVisible: boolean;
    setIsVisible?: (state: boolean) => SetStateAction<void>;
    setVisibleFunction?: () => void;
    actionFunction?: () => void;
    color: string;
    icon: string;
    iconSize?: string;
    iconPosition?: 'flex-start' | 'center' | 'flex-end';
    title?: string;
    description?: React.ReactNode;
    buttonText?: string;
    actionEnabled?: boolean;
    isLoading?: boolean;
    suppressReturnButton?: boolean;
    zIndex?: number;
    children?: React.ReactNode
}

import { AnimatePresence } from "framer-motion";
import Button from '../Button';

export default function Modal({ isVisible, setIsVisible, setVisibleFunction, actionFunction, actionEnabled = true, color, isLoading, icon, title, description, buttonText, suppressReturnButton, zIndex, iconSize, iconPosition, children }: Props) {
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
                            <div style={{ backgroundColor: color, alignSelf: iconPosition ? iconPosition : "center" }} className={styles.iconHolder}>
                                <span className={'material-symbols-rounded static'} style={{ color: "var(--light", fontSize: iconSize ? iconSize : "4.8rem" }}>{icon}</span>
                            </div>

                            {
                                title &&
                                <h2>{title}</h2>
                            }
                            {
                                description &&
                                <p>{description}</p>
                            }

                            {children}

                            <div className={styles.buttonsHolder}>
                                {
                                    !suppressReturnButton && !isLoading &&
                                    <Button
                                        onClick={() => {
                                            if (setIsVisible) {
                                                setIsVisible(!isVisible)
                                            } else if (setVisibleFunction) {
                                                setVisibleFunction()
                                            }
                                        }}
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
                                        disabled={!actionEnabled}
                                        isLoading={isLoading}
                                        icon={icon}
                                        iconColor={'var(--light)'}
                                        style={{
                                            background: actionEnabled ? color : "var(--light-gray)",
                                            cursor: actionEnabled ? "pointer" : "not-allowed",
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