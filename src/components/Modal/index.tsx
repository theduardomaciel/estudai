import styles from './modal.module.css';
import React, { useRef } from 'react';

import { AnimatePresence, MotionStyle, motion } from "framer-motion";

// Components
import Button from '../Button';
import { TranslateText } from '../Translate';

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
    isVisible: boolean;
    style?: MotionStyle;
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
        function?: () => void,
        buttonIcon?: string,
        isForm?: boolean,
    },

    isLoading?: boolean;
    suppressReturnButton?: boolean;
}

export default function Modal({ isVisible, toggleVisibility, style, color, isLoading, icon, title, description, suppressReturnButton, iconProps, actionProps, children, ...rest }: ModalProps) {

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = event.nativeEvent.target as HTMLDivElement;
        if (target.id === "background" && !isLoading) {
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
                        id='background'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(event) => handleClick(event)}
                    >
                        <motion.div
                            className={styles.container}
                            key="modalContent"
                            style={style}
                            initial={{ y: 300, x: 0, opacity: 0 }}
                            animate={{ y: 0, x: 0, opacity: 1 }}
                            exit={{ y: 300, x: 0, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.65 }}
                        >
                            <div className={styles.headerContainer} >
                                <div className={styles.headerContainer} style={{ justifyContent: iconProps?.position ? iconProps?.position : "center" }}>
                                    <div style={{ backgroundColor: color }} className={styles.iconHolder}>
                                        <span
                                            className={'material-icons-rounded static'}
                                            style={{ color: "var(--light)", fontSize: iconProps?.size ? iconProps?.size : "4.8rem" }}>
                                            {icon}
                                        </span>
                                    </div>
                                    {
                                        iconProps?.builtWithTitle && <h2 style={{ textAlign: "left", fontSize: iconProps.size ? iconProps.size : "3.8rem", lineHeight: "3.25rem" }}>{title}</h2>
                                    }
                                </div>
                                {
                                    iconProps?.position === "flex-start" && !isLoading &&
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
                                <h2 style={{ color: color ? color : "var(--primary-02)" }}>{title}</h2>
                            }
                            {
                                description &&
                                <p className={styles.description} style={{ color: color ? color : "var(--primary-02)" }}>{description}</p>
                            }

                            {children}

                            {
                                !actionProps?.isForm && <div className={styles.buttonsHolder}>
                                    {
                                        !suppressReturnButton && !isLoading /* && iconProps?.position !== "flex-start" */ &&
                                        <Button
                                            onClick={toggleVisibility}
                                            title={actionProps?.function ? TranslateText(`Cancel`) : TranslateText("Return")}
                                            icon={actionProps?.function ? 'close' : 'arrow_back'}
                                            style={{
                                                textTransform: "uppercase",
                                                background: color ? color === "var(--primary-02)" ? 'var(--primary-04)' : "var(--font-light)" : "var(--primary-02)",
                                                padding: `0.7rem 1.5rem`
                                            }}
                                            accentColor={color && "var(--light-gray)"}
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
                                            accentColor={color && color}
                                        />
                                    }
                                </div>
                            }
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}