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
    buttontype?: 'sendForm'
    iconFill?: number;
}

function Button(props: ButtonProps) {
    return <button
        style={{ flexDirection: props.iconPosition === "right" ? "row-reverse" : "row" }}
        className={` ${props.classes} ${styles.button} ${props.selected ? styles.selected : ""} ${props.buttontype ? styles[props.buttontype] : ""}`}
        {...props}
    >
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
    </button>
}

export default Button;