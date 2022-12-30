import React, { useState, useRef, useEffect } from 'react';

import Modal, { ModalProps } from '..';

// Stylesheets
import taskStyles from '../../../styles/Task.module.css';
import inputStyles from "../../Input/label.module.css";
import menuStyles from "../../Menu/menu.module.css"

// Types
import { Contents, Task, TaskMode, TaskType } from '../../../types/Task';

// Data
import { taskGroupType } from '../../Task';

// Components
import Calendar from '../../Calendar';
import { ActivityModeSelector, ActivityTypeSelector, EventAddressSelector, EventTitleSelector, MaxScoreSelector, QuestionsAmountSelector, SubjectsContentsSelector, SubjectSelector } from "../../../pages/groups/task/new";
import Button from '../../Button';
import SubjectsSelector from '../../SubjectsSelector';
import SubjectsModalPreset from './SubjectsModal';
import CustomEditor from '../../Editor';

// Editor
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder'

// Routing and Authentication
import { api } from '../../../lib/api';
import { useRouter } from 'next/router';
import { Subject } from '../../../types/Subject';
import Translate, { TranslateText } from '../../Translate';

export default function EditTaskModalPreset(task: Task) {
    const router = useRouter();

    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const [isActivity, isTest] = taskGroupType(task.type)

    /* ------------------------------------------------------------------------------ */

    const taskDate = new Date(task.date);
    const [newDate, setNewDate] = useState<number>(taskDate.getTime())

    const [newTaskType, setNewTaskType] = useState<TaskType>(task.type)
    const [newMaxScore, setNewMaxScore] = useState(task.maxScore)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                // Use a placeholder:
                placeholder: task.description,
            }),
            Highlight.configure({ multicolor: true }),
        ],
        content: task.description,
    })

    // Activity Specific
    const [newMode, setNewMode] = useState<TaskMode>(task.mode as TaskMode);

    // Test Specific

    const [newSubjects, setNewSubjects] = useState<Array<Subject>>(task.subjects)
    const [newContents, setNewContents] = useState<Contents | undefined>(task.contents);
    const [newQuestionsAmount, setNewQuestionsAmount] = useState<number | undefined>(task.questionsAmount);

    const [subjectsData, setSubjectsData] = useState<{ defaultSubjects: Array<Subject> | undefined, userSubjects: Array<Subject> | undefined }>({ defaultSubjects: undefined, userSubjects: undefined })

    useEffect(() => {
        async function getSubjects() {
            const response = await api.get(`/subjects/true`)
            if (response.status === 200) {
                console.log("Matérias obtidas com sucesso.")
                setSubjectsData({ userSubjects: response.data.userSubjects ? response.data.userSubjects : undefined, defaultSubjects: response.data.defaultSubjects })
            }
        }
        getSubjects()
    }, [])

    const { SubjectsModal, setSubjectsModalVisible } = SubjectsModalPreset(subjectsData.userSubjects, subjectsData.defaultSubjects, newSubjects, setNewSubjects)

    // Event Specific
    const [newTitle, setNewTitle] = useState(task.title);
    const [newAddress, setNewAddress] = useState(task.address);

    /* ------------------------------------------------------------------------------ */

    const hasDifferences = isActivity ?
        task.date !== new Date(newDate).getTime() ||
        editor && editor.getHTML().length > 0 && editor?.getHTML() !== task.description ||
        task.subjects[0] !== newSubjects[0] ||
        task.mode !== newMode ||
        task.type !== newTaskType ||
        newMaxScore !== undefined && task.maxScore !== newMaxScore :
        isTest ?
            task.date !== new Date(newDate).getTime() ||
            task.subjects !== newSubjects ||
            task.type !== newTaskType ||
            newMaxScore !== undefined && task.maxScore !== newMaxScore ||
            newQuestionsAmount !== undefined && task.questionsAmount !== newQuestionsAmount ||
            task.contents !== newContents
            :
            task.date !== new Date(newDate).getTime() ||
            task.title !== newTitle ||
            task.address !== newAddress ||
            editor && editor.getHTML().length > 0 && editor?.getHTML() !== task.description;

    /* ------------------------------------------------------------------------------ */

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const ConfirmDeleteModal = <Modal
        icon={'delete_forever'}
        isVisible={isDeleteModalVisible}
        toggleVisibility={() => setDeleteModalVisible(!isDeleteModalVisible)}
        isLoading={isLoading}
        color={"var(--red-01)"}
        title={TranslateText("Are you sure you want to delete this task?")}
        description={TranslateText("Watch out! Anyone who has access to this task will no longer be able to view it.\nThere is no way to recover a deleted activity.")}
        actionProps={{
            buttonText: TranslateText("Delete"),
            function: deleteTask
        }}
    />

    /* ------------------------------------------------------------------------------ */

    async function deleteTask() {
        setLoading(true)

        try {
            const response = await api.delete(`/tasks/${task.id}`)
            if (task.group) {
                router.push(`/groups/${task.group.id}`)
            } else {
                router.push(`/home`)
            }
        } catch (error) {
            setDeleteModalVisible(false)
            setLoading(false)
        }
    }

    const hasUpdated = useRef<boolean>(false);

    async function updateTask() {
        setLoading(true)
        console.log('Atualizando tarefa...')

        const data = {
            id: task.id,
            type: newTaskType !== task.type ? newTaskType : null,
            date: newDate,
            mode: newMode !== task.mode ? newMode : null,
            /* storage: task.group ? task.group.id : "account", */
            contents: newContents !== task.contents ? newContents : null,
            description: editor?.getHTML(),
            title: newTitle !== task.title ? newTitle : null,
            address: newAddress !== task.address ? newAddress : null,
            subjects: newSubjects !== task.subjects ? newSubjects : null,
            questionsAmount: newQuestionsAmount !== task.questionsAmount ? newQuestionsAmount : null,
            maxScore: newMaxScore !== task.maxScore ? newMaxScore : null,
        }

        console.log(data)

        try {
            if (!hasUpdated.current) {
                const response = await api.patch(`/tasks/${task.id}`, data)
                hasUpdated.current = true

                console.log(response.data)

                router.push(`/task/${task.id}`)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)

            setLoading(false)
        }
    }

    const CalendarColumn = <div className={taskStyles.column}>
        <h3 className={menuStyles.title}>Data</h3>
        <Calendar initialDate={taskDate} setDate={setNewDate} />
    </div>

    const DetailsTitle = <h3 className={menuStyles.title}><Translate>Details</Translate></h3>

    const DangerZone = ({ onClick, buttonText }: { onClick: () => void, buttonText: string }) => {
        return (
            <div className={'dangerZone'}>
                <p><Translate>Danger Zone</Translate></p>
                <Button
                    icon={"delete_forever"}
                    iconProps={{
                        filled: true,
                        size: "1.6rem"
                    }}
                    accentColor={'var(--red-02)'}
                    title={buttonText}
                    style={{
                        width: "100%",
                        backgroundColor: "var(--red-01)",
                        padding: "1rem 2.5rem"
                    }}
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={onClick}
                />
            </div>
        )
    }

    const EditModalProps = {
        icon: 'edit',
        isVisible: isModalVisible,
        toggleVisibility: () => setModalVisible(!isModalVisible),
        isLoading: isLoading,
        color: "var(--primary-02)",
        style: { maxHeight: "90vh", minWidth: "40vw" },
        iconProps: { position: "flex-start", size: '2.4rem', builtWithTitle: true },
        suppressReturnButton: true,
        actionProps: {
            buttonText: TranslateText("Save"),
            buttonIcon: "save",
            disabled: !hasDifferences,
            function: updateTask
        }
    } as ModalProps;

    return {
        EditTaskModal: isActivity ?
            <Modal title={TranslateText("Edit task")} {...EditModalProps}>
                <div className={taskStyles.contentsHolder} style={{ padding: "0.5rem" }}>
                    <div className={taskStyles.modalRow}>
                        {CalendarColumn}
                        <div className={taskStyles.column} style={{ height: "initial", justifyContent: "space-between" }}>
                            {DetailsTitle}
                            <ActivityTypeSelector limitType='activity' defaultValue={task.type} setType={setNewTaskType} />
                            <ActivityModeSelector defaultValue={task.mode} setSelectedValue={setNewMode} />
                            <MaxScoreSelector defaultValue={task.maxScore?.toString()} setSelectedValue={setNewMaxScore} />
                        </div>
                    </div>
                    {
                        task.subjects.length > 0 && <SubjectSelector defaultValue={task.subjects[0].id} setSelectedValue={setNewSubjects} userSubjects={subjectsData.userSubjects} defaultSubjects={subjectsData.defaultSubjects} />
                    }
                    <CustomEditor editor={editor} />
                    <DangerZone buttonText={TranslateText("Delete task")} onClick={() => setDeleteModalVisible(true)} />
                </div>
                {ConfirmDeleteModal}
            </Modal>
            : isTest ?
                <Modal title={TranslateText("Edit test")} {...EditModalProps}>
                    <div className={taskStyles.contentsHolder} style={{ padding: "0.5rem" }}>
                        <div className={taskStyles.modalRow}>
                            {CalendarColumn}
                            <div className={taskStyles.column} style={{ height: "initial", justifyContent: "space-between" }}>
                                {DetailsTitle}
                                <ActivityTypeSelector limitType='test' defaultValue={task.type} setType={setNewTaskType} />
                                <MaxScoreSelector defaultValue={task.maxScore?.toString()} setSelectedValue={setNewMaxScore} />
                                <QuestionsAmountSelector defaultValue={task.questionsAmount?.toString()} setSelectedValue={setNewQuestionsAmount} />
                            </div>
                        </div>
                        <SubjectsSelector setSubjects={setNewSubjects} subjects={newSubjects} openModal={() => setSubjectsModalVisible(true)} />
                        <SubjectsContentsSelector subjects={task.subjects} stateContents={newContents} setContents={setNewContents} />
                        <DangerZone buttonText={TranslateText("Delete test")} onClick={() => setDeleteModalVisible(true)} />
                    </div>
                    {SubjectsModal}
                    {ConfirmDeleteModal}
                </Modal> :
                <Modal title={TranslateText("Edit event")} {...EditModalProps}>
                    <div className={taskStyles.contentsHolder} style={{ padding: "0.5rem" }}>
                        <div className={taskStyles.modalRow}>
                            {CalendarColumn}
                            <div className={taskStyles.column} style={{ height: "initial", justifyContent: "space-between" }}>
                                {DetailsTitle}
                                <ActivityTypeSelector limitType='event' defaultValue={task.type} setType={setNewTaskType} />
                                <EventTitleSelector defaultValue={task.title} setSelectedValue={setNewTitle} />
                                <EventAddressSelector defaultValue={task.address} setSelectedValue={setNewAddress} />
                            </div>
                        </div>
                        <CustomEditor editor={editor} />
                        <DangerZone buttonText={TranslateText("Delete event")} onClick={() => setDeleteModalVisible(true)} />
                    </div>
                    {ConfirmDeleteModal}
                </Modal>,
        setEditTaskModalVisible: setModalVisible
    }
}