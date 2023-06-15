import React, { useEffect, useState } from "react";
import Topic from ".";
import useHorizontalScroll from "../../../hooks/useHorizontalScroll";

import styles from "./topic.module.css";

interface Topic {
    icon: string;
    title: string;
}

interface TopicsGroupProps {
    topics: Array<Topic>;
    topicIdRef: React.MutableRefObject<number>;
}

export default function TopicsGroup(props: TopicsGroupProps) {
    const [selected, setSelected] = useState<number | null>(null);

    const { setHorizontalScroll } = useHorizontalScroll();

    useEffect(() => {
        setHorizontalScroll("topicsScroll")
    }, [])

    return <ul id="topicsScroll" className={`row ${styles.topics} static`} style={{ overflow: "scroll" }}>
        {
            props.topics.map((topic: Topic, index) =>
                <li style={{ minWidth: "fit-content" }} key={index}>
                    <Topic
                        icon={topic.icon}
                        title={topic.title}
                        onClick={() => {
                            selected === index ? setSelected(null) : setSelected(index) // dá a possibilidade de remover uma opção escolhida
                            setSelected(index)
                            props.topicIdRef.current = index;
                        }}
                        state={selected === index ? "selected" : "unselected"}
                    />
                </li>
            )
        }
    </ul>
}