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
    }
    isSelected?: boolean;
    preset?: 'sendForm' | 'fillHover'
}

const Button = React.forwardRef(function Button({ title, classes, isLoading, icon, iconProps, isSelected, preset, children, ...rest }: ButtonProps, ref) {
    return <button
        type={preset === "sendForm" ? "submit" : "button"}
        className={`${classes} ${styles.button} button ${preset ? styles[preset] : ""} ${isLoading ? styles.loading : ""} ${isSelected ? 'selected' : ""}`}
        disabled={isLoading}
        {...rest}
    >
        {
            isLoading ?
                <Spinner
                    size={parseFloat(iconProps?.size?.split('r')[0] as string) / 1.1}
                    color={preset === "fillHover" && isSelected || preset !== "fillHover" ? iconProps?.color as string : "var(--light)"}
                />
                :
                <>
                    {
                        icon && typeof icon === "string" ?
                            <span
                                style={{ fontSize: iconProps?.size ? iconProps.size : "2.4rem",/*  color: iconProps?.color ? iconProps.color : "var(--light)" */ }}
                                className={`material-symbols-rounded ${iconProps?.filled ? "instantFilled" : "instantOutlined"}`}
                            >
                                {icon}
                            </span> :
                            icon &&
                            <div>
                                {icon}
                            </div>
                    }
                    {title && title}
                    {children}
                </>
        }
        <style jsx>{`
            .button.${styles[preset as string]}:not(.selected):hover,
            .button.selected {
                background-color: ${iconProps?.color};
                color: ${iconProps?.color ? "var(--light)" : iconProps?.color}
            }

            .button.${styles[preset as string]}.selected:hover {
                background-color: transparent;
                color: ${iconProps?.color ? iconProps?.color : "var(--light)"}
            }
      `}</style>
    </button>
})

export default Button;