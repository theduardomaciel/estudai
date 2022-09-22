import React from "react";

import styles from "./button.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    title?: string;
    icon?: React.ReactElement;
    buttontype?: 'sendForm'
}

function Button(props: ButtonProps) {
    return <button className={`${styles.button} ${props.buttontype ? styles[props.buttontype] : ""}`} {...props}>
        {props.icon}
        {props.title && props.title}
        {props.children}
    </button>
}

export default Button;