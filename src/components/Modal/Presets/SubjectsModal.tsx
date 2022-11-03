import React, { useState, Dispatch, SetStateAction } from 'react';

import Modal from '..';

// Stylesheets
import taskStyles from '../../../styles/CreateTask.module.css';
import { subjectsData } from '../../../utils/getSubjectInfo';
import Button from '../../Button';
import Input from '../../Input';

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

    const [search, setSearch] = useState('');

    const defaultSubjectsList = <>
        {
            subjectsData.filter((subject, i) => search.length > 0 ? subject.name.toLowerCase().includes(search) : true).map((subject, index) => <li
                key={index}
                className={`${taskStyles.subjectFromList} ${subjects.indexOf(index) !== -1 ? taskStyles.selected : ""} click static`}
                onClick={() => toggleSubject(index, subjects, setSubjects)}
            >
                <div className={taskStyles.title}>
                    <span className={'material-symbols-rounded'}>{subject.icon}</span>
                    <p>{subject.name}</p>
                </div>
                <span className={'material-symbols-rounded'} style={{ opacity: subjects.indexOf(index) !== -1 ? 1 : 0, transition: '0.15s' }}>check_circle</span>
            </li>)
        }
    </>

    return {
        SubjectsModal: <Modal
            isVisible={isModalVisible}
            color={`var(--primary-02)`}
            icon={'subject'}
            style={{ minHeight: "90vh", gap: "2rem" }}
            iconProps={{ builtWithTitle: true, size: "2.8rem", position: "center" }}
            toggleVisibility={() => setModalVisible(!isModalVisible)}
            title={"Selecione as matérias da avaliação abaixo:"}
        >
            <Input
                icon='search'
                placeholder='Pesquisar matéria'
                onChange={(event) => setSearch(event.currentTarget.value.replaceAll(' ', '').toLowerCase())}
            />
            <div className={`${inputStyles.input} ${taskStyles.subjectsList} ${taskStyles.reforce} customScroll`}>
                <p>Minhas matérias</p>
                <Button
                    title='CRIAR MATÉRIA'
                    icon={'add'}
                    iconProps={{ size: "1.8rem" }}
                    style={{
                        width: "100%",
                        padding: "0.85rem 1.5rem"
                    }}
                />
                <p>Outras matérias</p>
                {defaultSubjectsList}
            </div>
        </Modal>,
        setSubjectsModalVisible: setModalVisible
    }
}