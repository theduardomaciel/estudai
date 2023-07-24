"use client";

import styles from "./modal.module.css";
import React, { FC, SVGProps } from "react";

import { AnimatePresence, motion } from "framer-motion";

// Components
import Button, { ButtonProps } from "../Button";

// Icons
import CloseIcon from "@material-symbols/svg-600/rounded/close.svg";
import ArrowBack from "@material-symbols/svg-600/rounded/arrow_back.svg";

// Internationalization
import { Translations } from "@/i18n/hooks";

// Utils
import { cn } from "@/lib/ui";
import { useRouter } from "next/navigation";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    color: string;

    suppressReturn?: boolean;
    includeClose?: boolean;

    title?: string;
    icon?: FC<SVGProps<HTMLOrSVGElement>>;
    headerProps?: {
        preset?: "default" | "big";
    };

    buttons?: React.ReactNode;

    dict: Translations["modal"]["default"];
}

const iconPresets = {
    default: {
        size: "2.8rem",
        padding: "1.5rem",
    },
    big: {
        size: "3.6rem",
        padding: "2rem",
    },
};

const DEFAULT_BUTTON_CLASSES = "w-full uppercase px-4 py-2 gap-3 shadow-none";

export function ModalButton({ className, children, ...rest }: ButtonProps) {
    return (
        <Button className={cn(DEFAULT_BUTTON_CLASSES, className)} {...rest}>
            {children}
        </Button>
    );
}

export function ModalWrapper({ children }: { children: React.ReactNode }) {
    return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

export default function Modal({
    title,
    style,
    color,
    className,
    icon: Icon,
    suppressReturn,
    includeClose,
    headerProps,
    children,
    dict,
    buttons,
    ...rest
}: ModalProps) {
    const router = useRouter();

    const handleBackgroundClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const target = event.nativeEvent.target as HTMLDivElement;
        if (target.id === "background" && !suppressReturn) {
            router.back();
        }
    };

    return (
        <motion.div
            className={styles.background}
            key={`$background-${title}`}
            id="background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleBackgroundClick}
            /* {...rest} */
        >
            <motion.div
                className={cn(
                    styles.container,
                    "flex max-w-[90vw] max-h-[90vh] lg:max-w-[57rem] lg:min-w-[35vw] overflow-y-auto flex-col items-center gap-9 p-13",
                    "rounded-2xl bg-background-01",
                    className
                )}
                key="modalContent"
                style={style}
                initial={{ y: 300, x: 0, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={{ y: 300, x: 0, opacity: 0 }}
                transition={{ type: "spring", duration: 0.45 }}
            >
                <div
                    className={
                        "flex flex-row items-start justify-between self-stretch"
                    }
                >
                    <div
                        className={
                            "flex flex-col justify-center items-center lg:items-start gap-5"
                        }
                    >
                        {
                            Icon && (
                                <div
                                    style={{
                                        backgroundColor: color,
                                        padding:
                                            iconPresets[
                                                headerProps?.preset ?? "default"
                                            ].padding,
                                    }}
                                    className={styles.iconHolder}
                                >
                                    <Icon
                                        className="icon"
                                        color={"var(--neutral)"}
                                        fontSize={
                                            iconPresets[
                                                headerProps?.preset ?? "default"
                                            ].size
                                        }
                                    />
                                </div>
                            )
                            /*  */
                        }
                        <h2>{title}</h2>
                    </div>
                    {!suppressReturn && includeClose && (
                        <CloseIcon
                            className={`${styles.closeIcon} icon`}
                            color="var(--primary-02)"
                            fontSize={"4.8rem"}
                            onClick={() => router.back()}
                        />
                    )}
                </div>

                {children}

                <div className="flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-3.5 self-stretch w-full">
                    {!suppressReturn && (
                        <Button
                            onClick={() => router.back()}
                            className={DEFAULT_BUTTON_CLASSES}
                            preset="neutral"
                        >
                            <CloseIcon
                                className={`icon text-font-light`}
                                fontSize={`2.4rem`}
                            />
                            {dict.cancel}
                        </Button>
                    )}
                    {buttons}
                </div>
            </motion.div>
        </motion.div>
    );
}
