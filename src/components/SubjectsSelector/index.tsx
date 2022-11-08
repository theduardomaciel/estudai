import React, { SetStateAction, useEffect, useRef, Dispatch } from "react";

import styles from "./styles.module.css"
import inputStyles from '../Input/label.module.css';

// Components
import { InputLabel } from "../Input";
import Button from "../Button";
import { toggleSubject } from "../Modal/Presets/SubjectsModal";

import { Subject } from "../../types/Subject";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";

interface TaskProps {
    openModal: () => void;
    subjects: Array<Subject>;
    setSubjects: Dispatch<SetStateAction<Array<Subject>>>;
}

export default function SubjectsSelector({ subjects, setSubjects, openModal }: TaskProps) {
    const moveScroll = useHorizontalScroll('subjectsScroll', true);

    const Tag = ({ subject }: { subject: Subject }) => <li key={subject.id} onClick={() => toggleSubject(subject, subjects, setSubjects)} className={styles.tag} style={{ border: "none", opacity: 1, color: "var(--light)" }}>
        <span className={`material-icons-round`}>{subject.icon}</span>
        <p>{subject.name}</p>
        <span className={`material-icons-round`}>close</span>
    </li>

    return <div className={`${styles.container}`}>
        <InputLabel label="Quais matérias estarão presentes na avaliação?" />
        <div className={`${inputStyles.input} ${styles.tagsContainer}`} style={{ justifyContent: "space-between", padding: "1rem" }}>
            <div id="subjectsScroll" className={`${styles.tagsContainer}`}>
                {
                    subjects.map((subject, index) => <Tag key={index} subject={subject} />)
                }
            </div>
            <Button icon={"add"} style={{ padding: "0.5rem" }} onClick={() => openModal()} />
        </div>
    </div>
}