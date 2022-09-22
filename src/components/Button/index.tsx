import React from "react";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    title?: string;
    icon?: React.ReactElement;
    classes?: string;
    buttontype?: 'sendForm'
}

function Button(props: ButtonProps) {
    return <button className={` ${props.classes} ${styles.button} ${props.buttontype ? styles[props.buttontype] : ""}`} {...props}>
        {props.icon}
        {props.title && props.title}
        {props.children}
    </button>
}

export default Button;