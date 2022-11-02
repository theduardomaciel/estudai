import React, { useState, Dispatch, SetStateAction } from 'react';

import Modal from '..';

// Stylesheets
import taskStyles from '../../../styles/CreateTask.module.css';
import { subjectsData } from '../../../utils/getSubjectInfo';

// Data
import inputStyles from "../../Input/label.module.css";

export function toggleSubject(subjectId: number, subjects: Array<number>, setSubjects: Dispatch<SetStateAction<Array<number>>>) {
    const indexOnArray = subjects.indexOf(subjectId)
    if (indexOnArray !== -1) {
        let subjectsStateCopy = [...subjects];
        subjectsStateCopy.splice(indexOnArray, 1)
        setSubjects(subjectsStateCopy)
    } else {
        let subjectsStateCopy = [...subjects];
        subjectsStateCopy.push(subjectId)
        setSubjects(subjectsStateCopy)
    }
}

export default function SubjectsModalPreset(subjects: Array<number>, setSubjects: Dispatch<SetStateAction<Array<number>>>) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const subjectsList = <div className={`${inputStyles.input} ${taskStyles.subjectsList} ${taskStyles.reforce} click static`}>
        {
            subjectsData.map((subject, index) => <li
                key={index}
                className={`${taskStyles.subjectFromList} ${subjects.indexOf(index) !== -1 ? taskStyles.selected : ""}`}
                onClick={() => toggleSubject(index, subjects, setSubjects)}
            >
                <div className={taskStyles.title}>
                    <span className={'material-symbols-rounded'}>{subject.icon}</span>
                    <p>{subject.name}</p>
                </div>
                <span className={'material-symbols-rounded'} style={{ opacity: subjects.indexOf(index) !== -1 ? 1 : 0, transition: '0.15s' }}>check_circle</span>
            </li>)
        }
    </div>

    return {
        SubjectsModal: <Modal
            isVisible={isModalVisible}
            color={`var(--primary-02)`}
            icon={'subject'}
            iconProps={{ builtWithTitle: true, size: "2.8rem", position: "center" }}
            toggleVisibility={() => setModalVisible(!isModalVisible)}
            title={"Selecione as matérias da avaliação abaixo:"}
        >
            {subjectsList}
        </Modal>,
        setSubjectsModalVisible: setModalVisible
    }
}