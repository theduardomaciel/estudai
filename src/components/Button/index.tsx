import React from "react";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & React.InputHTMLAttributes<HTMLInputElement> & {
    title?: string;
    classes?: string;
    isSelected?: boolean;
    isLoading?: boolean;
    icon?: React.ReactElement | string;
    iconSize?: string | number;
    iconFill?: number;
    iconColor?: string;
    preset?: 'sendForm' | 'fillHover'
    ref?: React.ForwardedRef<any>;
    isInput?: boolean;
}

function Button({ title, classes, isSelected, isLoading, icon, iconSize, iconFill, iconColor, preset, ref, children, isInput, ...rest }: ButtonProps) {

    const Element = ({ children, className, ...rest }: any) => isInput ?
        <div className={className}>
            <div>{children}</div>
            <input id={title} {...rest} type="submit" />
        </div> :
        <button {...rest}>{children}</button>

    return <button
        ref={ref}
        type={preset === "sendForm" ? "submit" : "button"}
        className={`${classes} ${styles.button} ${isSelected ? 'buttonSelected' : ""}  ${preset ? styles[preset] : ""}  ${isLoading ? styles.loading : ""} `}
        disabled={isLoading}
        {...rest}
    >
        {
            isLoading ?
                <div className={styles.loader}>
                    <div style={{ borderColor: `${iconColor ? iconColor : "var(--light)"} transparent transparent transparent` }} />
                    <div style={{ borderColor: `${iconColor ? iconColor : "var(--light)"} transparent transparent transparent` }} />
                </div>
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
}

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