import styles from './modal.module.css';
import React, { SetStateAction } from 'react';

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion"

// Components
import Button from '../Button';

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

type Props = React.HTMLAttributes<HTMLDivElement> & {
    isVisible: boolean;
    toggleVisibility: () => void;
    actionFunction?: () => void;

    color: string;
    title?: string;
    description?: React.ReactNode;

    icon: string;
    iconProps?: {
        size?: string,
        position?: 'flex-start' | 'center' | 'flex-end',
        builtWithTitle?: boolean,
    }

    buttonText?: string;
    actionEnabled?: boolean;
    isLoading?: boolean;
    suppressReturnButton?: boolean;
}

export default function Modal({ isVisible, toggleVisibility, actionFunction, actionEnabled = true, color, isLoading, icon, title, description, buttonText, suppressReturnButton, iconProps, children, ...rest }: Props) {
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
                    >
                        <div className={styles.container} {...rest}>
                            <div className={styles.headerContainer} style={{ justifyContent: iconProps?.position ? iconProps?.position : "center" }}>
                                <div style={{ backgroundColor: color }} className={styles.iconHolder}>
                                    <span
                                        className={'material-symbols-rounded static'}
                                        style={{ color: "var(--light", fontSize: iconProps?.size ? iconProps?.size : "4.8rem" }}>
                                        {icon}
                                    </span>
                                </div>
                                {
                                    iconProps?.builtWithTitle && <h2>{title}</h2>
                                }
                            </div>

                            {
                                title && !iconProps?.builtWithTitle &&
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
                                        onClick={toggleVisibility}
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
                                        iconProps={{ color: 'var(--light)' }}
                                        style={{
                                            background: actionEnabled ? color : "var(--light-gray)",
                                            cursor: actionEnabled ? "pointer" : "not-allowed",
                                            padding: `0.7rem 1.5rem`,
                                            textTransform: "uppercase"
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