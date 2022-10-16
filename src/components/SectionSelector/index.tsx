import React, { SetStateAction, useState } from "react";

import styles from "./sectionSelector.module.css"

interface SectionSelectorProps {
    sections: Array<string>;
    actualSection: string;
    setSection: (state: string) => SetStateAction<void>
}

export default function SectionSelector({ sections, actualSection, setSection }: SectionSelectorProps) {
    return <ul className={styles.selector}>
        {
            sections.map((sectionName, index) => <li key={index}>
                <div onClick={() => setSection(sectionName)} className={`${styles.section} ${actualSection === sectionName ? styles.selected : ""}`}>
                    <p>{sectionName}</p>
                    <div />
                </div>
            </li>
            )
        }
    </ul>
}