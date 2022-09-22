import React, { useState } from "react";

import styles from "./sectionSelector.module.css"

interface SectionSelectorProps {
    sections: Array<string>;
}

export default function SectionSelector(props: SectionSelectorProps) {
    const [selected, setSelected] = useState(0)

    return <ul className={styles.selector}>
        {
            props.sections.map((section, index) => <li key={index}>
                <div onClick={() => setSelected(index)} className={`${styles.section} ${selected === index ? styles.selected : ""}`}>
                    <p>{section}</p>
                    <div />
                </div>
            </li>
            )
        }
    </ul>
}