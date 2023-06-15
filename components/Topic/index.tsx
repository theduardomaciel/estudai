import React, { useState } from "react";

import styles from "./topic.module.css"

/* type TopicProps = React.ReactHTMLElement<HTMLDivElement> & */
interface TopicProps {
    icon: string;
    title: string;
    defaultState?: 'unselected' | 'selected';
    state?: 'unselected' | 'selected';
    onClick?: () => void;
}

function Topic(props: TopicProps) {
    const [state, setState] = useState(props.defaultState ? props.defaultState : "unselected");

    const stateToUse = props.state ? props.state : state;

    return <div
        onClick={() => {
            setState(stateToUse === "selected" ? "unselected" : "selected")
            if (props.onClick) {
                props.onClick()
            }
        }}
        className={`click ${styles.default} ${styles[stateToUse !== "unselected" ? "selected" : ""]}`}
    >
        <p>{props.icon}</p>
        {
            stateToUse === "selected" &&
            <span>{props.title}</span>
        }
    </div>
}

export default Topic;