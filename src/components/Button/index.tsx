import React from "react";
import Spinner from "../Spinner";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title?: string;
    classes?: string;
    isSelected?: boolean;
    isLoading?: boolean;
    icon?: React.ReactElement | string;
    iconSize?: string | number;
    iconFill?: number;
    iconColor?: string;
    preset?: 'sendForm' | 'fillHover'
    isInput?: boolean;
}

const Button = React.forwardRef(function Button({ title, classes, isSelected, isLoading, icon, iconSize, iconFill, iconColor, preset, children, isInput, ...rest }: ButtonProps, ref) {
    return <button
        type={preset === "sendForm" ? "submit" : "button"}
        className={`${classes} ${styles.button} ${isSelected ? 'buttonSelected' : ""}  ${preset ? styles[preset] : ""}  ${isLoading ? styles.loading : ""} `}
        disabled={isLoading}
        {...rest}
    >
        {
            isLoading ?
                <Spinner color={iconColor as string} />
                :
                <>
                    {
                        icon && typeof icon === "string" ?
                            <span
                                style={{ fontSize: iconSize, color: iconColor }}
                                className={`material-symbols-rounded ${iconFill === 1 ? "filled" : "outlined"}`}
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
    </button>
})

export default Button;

{/* <style jsx>{`
            button {
                border: ${borderWidth ? borderWidth : "1px"} solid ${color ? color : `var(--light-gray)`};
                background: ${backgroundColorStyle};
                color: ${colorStyle};
                padding: ${padding ? padding : `0.75rem 1.5rem`};
            }

            button span {
                color: ${contentColor ? contentColor : color ? color : `var(--light-gray)`}
            }

            button:hover {
                background-color: ${color ? color : `var(--light-gray)`};
                color: var(--background-02);
            }

            `}</style> */}