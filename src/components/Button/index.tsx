import React from "react";
import Spinner from "../Spinner";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title?: string;
    classes?: string;
    isLoading?: boolean;
    icon?: React.ReactElement | string;
    accentColor?: string;
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

const Button = React.forwardRef(function Button({ title, classes, isLoading, icon, accentColor, iconProps, isSelected, preset, children, disableHoverEffect, ...rest }: ButtonProps, ref) {
    return <button
        type={preset === "sendForm" ? "submit" : "button"}
        className={`${classes} ${styles.button} button ${preset ? styles[preset] : ""} ${isLoading ? styles.loading : ""} ${isSelected ? 'selected' : ""} ${disableHoverEffect ? 'disableHoverEffect' : ""}`}
        disabled={isLoading}
        {...rest}
    >
        {
            isLoading ?
                <Spinner
                    classes={styles.hovered}
                    size={parseFloat(iconProps?.size?.split('r')[0] as string) / 1.125}
                    color={"var(--light)"}
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
            .button.selected,
            .button.${styles.loading} {
                background-color: ${iconProps?.color};
                color: ${iconProps?.color ? "var(--light)" : iconProps?.color};
            }

            .button.${styles.fillHover}.selected:hover {
                filter: brightness(1.15);
            }

            .button:not(.${styles.sendForm}):not(.${styles.fillHover}):not(.${styles.loading}):not(.disableHoverEffect):hover {
                outline: 2px solid ${accentColor ? accentColor : 'var(--primary-04)'};
            }
            
            .button:not(.${styles.sendForm}):not(.${styles.fillHover}):not(.${styles.loading}):not(.disableHoverEffect):active {
                outline: 2px solid var(--light);
                transition: 0.1s;
            }
      `}</style>
    </button>
})

export default Button;