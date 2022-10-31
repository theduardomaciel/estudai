import React, { SetStateAction, useEffect, useRef, Dispatch } from "react";
import UsersPortraits from "../UsersPortraits";

import styles from "./styles.module.css"
import inputStyles from '../Input/label.module.css';

// Contexto
import { useAppContext } from "../../contexts/AppContext";
import Link from "next/link";
import { InputLabel } from "../Input";
import Button from "../Button";
import getSubjectInfo from "../../utils/getSubjectInfo";
import { toggleSubject } from "../Modal/Presets/SubjectsModal";

interface TaskProps {
    openModal: () => void;
    subjects: Array<number>;
    setSubjects: Dispatch<SetStateAction<Array<number>>>;
}

export default function SubjectsSelector(props: TaskProps) {
    const Tag = ({ subjectId }: { subjectId: number }) => {
        const [name, icon] = getSubjectInfo(subjectId)

        return <li key={subjectId} onClick={() => toggleSubject(subjectId, props.subjects, props.setSubjects)} className={styles.tag} style={{ border: "none", opacity: 1, color: "var(--light)" }}>
            <span className={`material-symbols-rounded`}>{icon}</span>
            <p>{name}</p>
            <span className={`material-symbols-rounded`}>close</span>
        </li>
    }

    const tagsContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (tagsContainer.current) {
            tagsContainer.current.addEventListener("wheel", function (event) {
                if (tagsContainer.current) {
                    const container = tagsContainer.current
                    if (event.deltaY > 0) {
                        container.scrollTo({
                            top: 0,
                            left: container.scrollLeft + 100,
                            behavior: 'smooth'
                        });
                        event.preventDefault();
                        // preventDefault() will help avoid worrisome 
                        // inclusion of vertical scroll 
                    } else {
                        container.scrollTo({
                            top: 0,
                            left: container.scrollLeft - 100,
                            behavior: "smooth"
                        });
                        event.preventDefault();
                    }
                }
            });
        }
    }, [])

    return <div className={`${styles.container}`}>
        <InputLabel label="Quais matérias estarão presentes na avaliação?" />
        <div className={`${inputStyles.input} ${styles.tagsContainer}`} style={{ justifyContent: "space-between", padding: "1rem" }}>
            <div ref={tagsContainer} className={`${styles.tagsContainer}`}>
                {
                    props.subjects.map((subjectId, index) => <Tag key={index} subjectId={subjectId} />)
                }
            </div>
            <Button icon={"add"} style={{ padding: "0.5rem" }} onClick={() => props.openModal()} />
        </div>
    </div>
}