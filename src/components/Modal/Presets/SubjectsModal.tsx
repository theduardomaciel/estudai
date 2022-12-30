import React, { useState, Dispatch, SetStateAction } from 'react';

import Modal from '..';

// Stylesheets
import taskStyles from '../../../styles/CreateTask.module.css';
import { Subject } from '../../../types/Subject';
import Button from '../../Button';
import Input from '../../Input';

// Data
import inputStyles from "../../Input/label.module.css";
import Spinner from '../../Spinner';
import Translate, { TranslateText } from '../../Translate';
import NewSubjectModalPreset from './NewSubjectModal';

const teste = {
    "isdasdioajdoidenoem": "aosdjadsada",
    "iddamatéria": "assuntodamatéria"
}

export function toggleSubject(subject: Subject, subjects: Array<Subject>, setSubjects: Dispatch<SetStateAction<Array<Subject>>>) {
    const indexOnArray = subjects.indexOf(subject)
    if (indexOnArray !== -1) {
        let subjectsStateCopy = [...subjects];
        subjectsStateCopy.splice(indexOnArray, 1)
        setSubjects(subjectsStateCopy)
    } else {
        let subjectsStateCopy = [...subjects];
        subjectsStateCopy.push(subject)
        setSubjects(subjectsStateCopy)
    }
}

export default function SubjectsModalPreset(userSubjects: Array<Subject> | undefined, defaultSubjects: Array<Subject> | undefined, subjects: Array<Subject>, setSubjects: Dispatch<SetStateAction<Array<Subject>>>) {
    const [isModalVisible, setModalVisible] = useState(false)

    const [search, setSearch] = useState('');

    const userSubjectsList = <>
        {
            userSubjects ?
                userSubjects.filter((subject, i) => search.length > 0 ? subject.name.toLowerCase().includes(search) : true).map((subject, index) => <li
                    key={index}
                    className={`${taskStyles.subjectFromList} ${subjects.indexOf(subject) !== -1 ? taskStyles.selected : ""} click static`}
                    onClick={() => toggleSubject(subject, subjects, setSubjects)}
                >
                    <div className={taskStyles.title}>
                        <span className={'material-symbols-rounded'}>{subject.icon}</span>
                        <p>{subject.name}</p>
                    </div>
                    <span className={'material-symbols-rounded'} style={{ opacity: subjects.indexOf(subject) !== -1 ? 1 : 0, transition: '0.15s' }}>check_circle</span>
                </li>)
                :
                <div style={{ marginBlock: "1rem" }}>
                    <Spinner color='var(--primary-02)' />
                </div>
        }
    </>

    const defaultSubjectsList = <>
        {
            defaultSubjects ?
                defaultSubjects.filter((subject, i) => search.length > 0 ? subject.name.toLowerCase().includes(search) : true).map((subject, index) => <li
                    key={index}
                    className={`${taskStyles.subjectFromList} ${subjects.indexOf(subject) !== -1 ? taskStyles.selected : ""} click static`}
                    onClick={() => toggleSubject(subject, subjects, setSubjects)}
                >
                    <div className={taskStyles.title}>
                        <span className={'material-symbols-rounded'}>{subject.icon}</span>
                        <p><Translate>{subject.name}</Translate></p>
                    </div>
                    <span className={'material-symbols-rounded'} style={{ opacity: subjects.indexOf(subject) !== -1 ? 1 : 0, transition: '0.15s' }}>check_circle</span>
                </li>)
                :
                <Spinner color='var(--primary-02)' />
        }
    </>

    const { NewSubjectModal, setNewSubjectModalStatus } = NewSubjectModalPreset();

    return {
        SubjectsModal: <Modal
            isVisible={isModalVisible}
            color={`var(--primary-02)`}
            icon={'subject'}
            style={{ minHeight: "90vh", gap: "2rem" }}
            iconProps={{ builtWithTitle: true, size: "2.8rem", position: "center" }}
            toggleVisibility={() => setModalVisible(!isModalVisible)}
            title={TranslateText("Select the test subjects below:")}
        >
            <Input
                icon='search'
                placeholder={TranslateText("Search subjects")}
                onChange={(event) => setSearch(event.currentTarget.value.replaceAll(' ', '').toLowerCase())}
            />
            <div className={`${inputStyles.input} ${taskStyles.subjectsList} ${taskStyles.reforce} customScroll`}>
                <p><Translate>My subjects</Translate></p>
                <Button
                    title={TranslateText("Create new subject")}
                    icon={'add'}
                    iconProps={{ size: "1.8rem" }}
                    style={{
                        width: "100%",
                        textTransform: "uppercase",
                        padding: "0.85rem 1.5rem"
                    }}
                    onClick={() => setNewSubjectModalStatus(true)}
                />
                {userSubjectsList}
                <p><Translate>Other subjects</Translate></p>
                {defaultSubjectsList}
            </div>
            {NewSubjectModal}
        </Modal>,
        setSubjectsModalVisible: setModalVisible
    }
}