import React from "react";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    style?: React.CSSProperties;
    title?: string;
    icon?: React.ReactElement | string;
    classes?: string;
    selected?: boolean;
    iconSize?: string | number;
    iconPosition?: 'left' | 'right';
    iconColor?: string;
    buttontype?: 'sendForm' | 'fillHover'
    iconFill?: number;
    isLoading?: boolean;
}

function Button(props: ButtonProps) {
    return <button
        style={{ flexDirection: props.iconPosition === "right" ? "row-reverse" : "row" }}
        className={` ${props.classes} ${styles.button} ${props.selected ? styles.selected : ""} ${props.buttontype ? styles[props.buttontype] : ""} ${props.isLoading ? styles.loading : ""}`}
        {...props}
    >
        {
            props.isLoading ?
                <div className={styles.loader}>
                    <div style={{ borderColor: `${props.iconColor} transparent transparent transparent` }} />
                    {/* <div /> */}
                </div>
                :
                <>
                    {typeof props.icon === "string" ?
                        <span
                            style={{ fontSize: props.iconSize ? props.iconSize : "", color: props.iconColor ? props.iconColor : "" }}
                            className={`material-symbols-rounded ${props.iconFill === 1 ? "filled" : "outlined"}`}
                        >
                            {props.icon}
                        </span> :
                        <div>
                            {props.icon}
                        </div>}
                    {props.title && props.title}
                    {props.children}
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