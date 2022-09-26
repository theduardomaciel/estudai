import React from "react";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    title?: string;
    icon?: React.ReactElement | string;
    classes?: string;
    iconSize?: string | number;
    selected?: boolean;
    buttontype?: 'sendForm'
}

function Button(props: ButtonProps) {
    return <button className={` ${props.classes} ${styles.button} ${props.selected ? styles.selected : ""} ${props.buttontype ? styles[props.buttontype] : ""}`} {...props}>
        {typeof props.icon === "string" ?
            <span style={{ fontSize: props.iconSize ? props.iconSize : "" }} className={`material-symbols-rounded`}>{props.icon}</span>
            : props.icon}
        {props.title && props.title}
        {props.children}
    </button>
}

export default Button;