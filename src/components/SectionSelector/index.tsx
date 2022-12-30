import React, { Dispatch, SetStateAction, useState } from "react";

import styles from "./sectionSelector.module.css"

interface Section {
    name: string;
    id: number
}

interface SectionSelectorProps {
    sections: Array<Section>;
    actualSection: Section;
    setSection: Dispatch<SetStateAction<Section>>
}

export default function SectionSelector({ sections, actualSection, setSection }: SectionSelectorProps) {
    return <ul className={styles.selector}>
        {
            sections.map((section, index) => <li key={index}>
                <div onClick={() => setSection(section)} className={`${styles.section} ${actualSection.id === section.id ? styles.selected : ""}`}>
                    <p>{section.name}</p>
                    <div />
                </div>
            </li>
            )
        }
    </ul>
}