import styles from './modal.module.css';
import React, { useRef } from 'react';

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion"

// Components
import Button from '../Button';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    isVisible: boolean;
    toggleVisibility: () => void;

    color: string;
    title?: string;
    description?: React.ReactNode;

    icon: string;
    iconProps?: {
        size?: string,
        position?: 'flex-start' | 'center' | 'flex-end',
        builtWithTitle?: boolean,
    }

    actionProps?: {
        buttonText: string,
        disabled?: boolean,
        function?: () => void;
        buttonIcon?: string,
    },

    isLoading?: boolean;
    suppressReturnButton?: boolean;
}

export default function Modal({ isVisible, toggleVisibility, color, isLoading, icon, title, description, suppressReturnButton, iconProps, actionProps, children, ...rest }: Props) {
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!modalRef.current?.contains(event.nativeEvent.target as Node)) {
            toggleVisibility()
        };
    }

    return (
        <AnimatePresence mode='wait'>
            {
                isVisible && (
                    <motion.div
                        className={styles.background}
                        key="modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(event) => handleClick(event)}
                    >
                        <motion.div
                            className={styles.container}
                            key="modalContent"
                            ref={modalRef}
                            initial={{ y: 300, x: 0, opacity: 0 }}
                            animate={{ y: 0, x: 0, opacity: 1 }}
                            exit={{ y: 300, x: 0, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.85 }}
                        >
                            <div className={styles.headerContainer} >
                                <div className={styles.headerContainer} style={{ justifyContent: iconProps?.position ? iconProps?.position : "center" }}>
                                    <div style={{ backgroundColor: color }} className={styles.iconHolder}>
                                        <span
                                            className={'material-symbols-rounded static'}
                                            style={{ color: "var(--light)", fontSize: iconProps?.size ? iconProps?.size : "4.8rem" }}>
                                            {icon}
                                        </span>
                                    </div>
                                    {
                                        iconProps?.builtWithTitle && <h2 style={{ textAlign: "left" }}>{title}</h2>
                                    }
                                </div>
                                {
                                    iconProps?.position === "flex-start" &&
                                    <div style={{ justifySelf: "flex-end" }}>
                                        <span
                                            className={'material-symbols-rounded static click'}
                                            style={{ color: "var(--primary-02)", fontSize: iconProps?.size ? iconProps?.size : "4.8rem" }}
                                            onClick={toggleVisibility}
                                        >
                                            close
                                        </span>
                                    </div>
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
                                    !suppressReturnButton && !isLoading && !iconProps?.builtWithTitle &&
                                    <Button
                                        onClick={toggleVisibility}
                                        title={actionProps?.function ? `CANCELAR` : "RETORNAR"}
                                        icon={actionProps?.function ? 'close' : 'arrow_back'}
                                        style={{
                                            background: "var(--primary-02)",
                                            padding: `0.7rem 1.5rem`
                                        }}
                                    />
                                }
                                {
                                    actionProps?.function &&
                                    <Button
                                        onClick={actionProps?.function}
                                        title={actionProps?.buttonText}
                                        disabled={actionProps?.disabled}
                                        isLoading={isLoading}
                                        icon={actionProps.buttonIcon ? actionProps.buttonIcon : icon}
                                        iconProps={{ color: 'var(--light)', filled: true }}
                                        disableHoverEffect={actionProps?.disabled}
                                        style={{
                                            background: !actionProps?.disabled ? color : "var(--light-gray)",
                                            padding: `0.7rem 1.5rem`,
                                            textTransform: "uppercase",
                                            cursor: actionProps.disabled || isLoading ? "not-allowed" : "pointer"
                                        }}
                                    />
                                }
                            </div>
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}