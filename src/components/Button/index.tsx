import React from "react";
import Spinner from "../Spinner";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title?: string;
    classes?: string;
    isLoading?: boolean;
    icon?: React.ReactElement | string;
    iconProps?: {
        size?: string,
        filled?: boolean,
        color?: string,
        position?: 'left' | 'right'
    }
    disableHoverEffect?: boolean;
    isSelected?: boolean;
    preset?: 'sendForm' | 'fillHover'
}

const Button = React.forwardRef(function Button({ title, classes, isLoading, icon, iconProps, isSelected, preset, children, disableHoverEffect, ...rest }: ButtonProps, ref) {
    return <button
        type={preset === "sendForm" ? "submit" : "button"}
        className={`${classes} ${styles.button} button ${preset ? styles[preset] : ""} ${isLoading ? styles.loading : ""} ${isSelected ? 'selected' : ""} ${disableHoverEffect ? styles.disableHoverEffect : ""}`}
        disabled={isLoading}
        {...rest}
    >
        {
            isLoading ?
                <Spinner
                    classes={styles.hovered}
                    size={parseFloat(iconProps?.size?.split('r')[0] as string) / 1.125}
                    color={preset === "fillHover" && isSelected ? iconProps?.color as string : iconProps?.color ? iconProps.color : "var(--light)"}
                />
                :
                <>
                    {
                        icon && typeof icon === "string" ?
                            <span
                                style={{
                                    fontSize: iconProps?.size ? iconProps.size : "2.4rem",
                                    flexDirection: iconProps?.position && iconProps?.position === 'right' ? "row-reverse" : "row"
                                    /*  color: iconProps?.color ? iconProps.color : "var(--light)" */
                                }}
                                className={`material-symbols-rounded ${iconProps?.filled ? "instantFilled" : "instantOutlined"}`}
                            >
                                {icon}
                            </span> :
                            icon &&
                            <div style={{
                                fontSize: iconProps?.size ? iconProps.size : "2.4rem",
                                flexDirection: iconProps?.position === 'left' ? "row-reverse" : "row"
                                /*  color: iconProps?.color ? iconProps.color : "var(--light)" */
                            }}>
                                {icon}
                            </div>
                    }
                    {title && title}
                    {children}
                </>
        }
        <style jsx>{`
            .button {
                background-color: ${preset === 'fillHover' ? 'transparent' : iconProps?.color};
                color: ${preset === 'fillHover' ? iconProps?.color : "var(--light)"};
                border: ${preset === 'fillHover' ? `1px solid ${iconProps?.color}` : "none"};
            }

            .button.${styles.fillHover}:not(.selected):hover,
            .button.selected {
                background-color: ${iconProps?.color};
                color: ${iconProps?.color ? "var(--light)" : iconProps?.color};
            }

            .button.${styles.fillHover}.selected:hover {
                filter: brightness(1.1);
            }
      `}</style>
    </button>
})

export default Button;