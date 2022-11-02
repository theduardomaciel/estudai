import React, { useState, useRef } from 'react';

import Modal from '..';

// Stylesheets
import taskStyles from '../../../styles/Task.module.css';
import inputStyles from "../../Input/label.module.css";
import menuStyles from "../../Menu/menu.module.css"

// Types
import { Task, TaskMode, TaskType } from '../../../types/Task';

// Data
import { perQuestion, subjectsString, taskGroupType, taskMaxScore, taskMode, taskType } from '../../Task';

// Components
import Calendar from '../../Calendar';
import { ActivityModeSelector, ActivityTypeSelector, DescriptionEditor, EventAddressSelector, EventTitleSelector, MaxScoreSelector, QuestionsAmountSelector, SubjectsContentsSelector, SubjectSelector } from "../../../pages/task/new";
import Button from '../../Button';
import SubjectsSelector from '../../SubjectsSelector';
import SubjectsModalPreset from './SubjectsModal';


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

    const [newSubjects, setNewSubjects] = useState<Array<number>>(task.subjects)
    const [newContents, setNewContents] = useState<Array<string>>(task.contents as Array<string>);
    const [newQuestionsAmount, setNewQuestionsAmount] = useState<number | undefined>(task.questionsAmount);

    const { SubjectsModal, setSubjectsModalVisible } = SubjectsModalPreset(newSubjects, setNewSubjects)

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
            task.contents !== newContents :
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
        title={"Você tem certeza que quer deletar esta tarefa?"}
        description={`Cuidado! Todos que tiverem acesso a esta tarefa não poderão mais visualizá-la.\nNão há como recuperar uma atividade excluída.`}
        actionProps={{
            buttonText: "DELETAR",
            function: deleteTask
        }}
    />

    /* ------------------------------------------------------------------------------ */

    async function deleteTask() {
        setLoading(true)

        try {
            const response = await api.delete(`/tasks/${task.id}`)
            console.log(response)
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

    async function updateTask() {
        setLoading(true)
        console.log('Atualizando tarefa...')

        const data = {
            id: task.id,
            type: newTaskType,
            date: newDate,
            mode: newMode,
            storage: task.group ? task.group.id : "account",
            contents: newContents,
            description: editor?.getHTML(),
            title: newTitle,
            address: newAddress,
            subjects: newSubjects,
            questionsAmount: newQuestionsAmount,
            maxScore: newMaxScore,
        }

        console.log(data)

        try {
            const response = await api.patch(`/tasks/${task.id}`, data)
            console.log(response.data)

            setLoading(false)
            router.push(`/task/${task.id}`)
        } catch (error) {
            console.log(error)

            setLoading(false)
        }
    }

    return {
        EditTaskModal: isActivity ?
            <Modal
                icon={'edit'}
                isVisible={isModalVisible}
                toggleVisibility={() => setModalVisible(!isModalVisible)}
                isLoading={isLoading}
                color={"var(--primary-02)"}
                style={{ maxHeight: "90vh", minWidth: "40vw" }}
                iconProps={{ position: "flex-start", size: '2.4rem', builtWithTitle: true }}
                suppressReturnButton
                title={"Editar atividade"}
                actionProps={{
                    buttonText: "SALVAR",
                    buttonIcon: "save",
                    disabled: !hasDifferences,
                    function: updateTask
                }}
            >
                <div className={taskStyles.contentsHolder} style={{ padding: "0.5rem" }}>
                    <div className={taskStyles.modalRow}>
                        <div className={taskStyles.column}>
                            <h3 className={menuStyles.title}>Data</h3>
                            <Calendar initialDate={taskDate} setDate={setNewDate} />
                        </div>
                        <div className={taskStyles.column} style={{ height: "initial", justifyContent: "space-between" }}>
                            <h3 className={menuStyles.title}>Detalhes</h3>
                            <ActivityTypeSelector limitType='activity' defaultValue={task.type} setType={setNewTaskType} />
                            <ActivityModeSelector defaultValue={task.mode} setSelectedValue={setNewMode} />
                            <MaxScoreSelector defaultValue={task.maxScore?.toString()} setSelectedValue={setNewMaxScore} />
                        </div>
                    </div>
                    <SubjectSelector defaultValue={task.subjects[0].toString()} setSelectedValue={setNewSubjects} />
                    <DescriptionEditor editor={editor} />
                    <div className={'dangerZone'}>
                        <p>Zona de Perigo</p>
                        <Button
                            icon={"delete_forever"}
                            iconProps={{
                                filled: true,
                                size: "1.6rem"
                            }}
                            accentColor={'var(--red-02)'}
                            title='EXCLUIR ATIVIDADE'
                            style={{
                                width: "100%",
                                backgroundColor: "var(--red-01)",
                                padding: "1rem 2.5rem"
                            }}
                            isLoading={isLoading}
                            onClick={() => setDeleteModalVisible(true)}
                        />
                    </div>
                </div>
                {ConfirmDeleteModal}
            </Modal>
            : isTest ?
                <Modal
                    icon={'edit'}
                    isVisible={isModalVisible}
                    toggleVisibility={() => setModalVisible(!isModalVisible)}
                    isLoading={isLoading}
                    color={"var(--primary-02)"}
                    style={{ maxHeight: "90vh", minWidth: "40vw" }}
                    iconProps={{ position: "flex-start", size: '2.4rem', builtWithTitle: true }}
                    suppressReturnButton
                    title={"Editar avaliação"}
                    actionProps={{
                        buttonText: "SALVAR",
                        buttonIcon: "save",
                        disabled: !hasDifferences,
                        function: updateTask
                    }}
                >
                    <div className={taskStyles.contentsHolder} style={{ padding: "0.5rem" }}>
                        <div className={taskStyles.modalRow}>
                            <div className={taskStyles.column}>
                                <h3 className={menuStyles.title}>Data</h3>
                                <Calendar initialDate={taskDate} setDate={setNewDate} />
                            </div>
                            <div className={taskStyles.column} style={{ height: "initial", justifyContent: "space-between" }}>
                                <h3 className={menuStyles.title}>Detalhes</h3>
                                <ActivityTypeSelector limitType='test' defaultValue={task.type} setType={setNewTaskType} />
                                <MaxScoreSelector defaultValue={task.maxScore?.toString()} setSelectedValue={setNewMaxScore} />
                                <QuestionsAmountSelector defaultValue={task.questionsAmount?.toString()} setSelectedValue={setNewQuestionsAmount} />
                            </div>
                        </div>
                        <SubjectsSelector setSubjects={setNewSubjects} subjects={newSubjects} openModal={() => setSubjectsModalVisible(true)} />
                        <SubjectsContentsSelector subjects={task.subjects} stateContents={newContents} setContents={setNewContents} />
                        <div className={'dangerZone'}>
                            <p>Zona de Perigo</p>
                            <Button
                                icon={"delete_forever"}
                                iconProps={{
                                    filled: true,
                                    size: "1.6rem"
                                }}
                                accentColor={'var(--red-02)'}
                                title='EXCLUIR AVALIAÇÃO'
                                style={{
                                    width: "100%",
                                    backgroundColor: "var(--red-01)",
                                    padding: "1rem 2.5rem"
                                }}
                                isLoading={isLoading}
                                onClick={() => setDeleteModalVisible(true)}
                            />
                        </div>
                    </div>
                    {SubjectsModal}
                    {ConfirmDeleteModal}
                </Modal> :
                <Modal
                    icon={'edit'}
                    isVisible={isModalVisible}
                    toggleVisibility={() => setModalVisible(!isModalVisible)}
                    isLoading={isLoading}
                    color={"var(--primary-02)"}
                    style={{ maxHeight: "90vh", minWidth: "40vw" }}
                    iconProps={{ position: "flex-start", size: '2.4rem', builtWithTitle: true }}
                    suppressReturnButton
                    title={"Editar evento"}
                    actionProps={{
                        buttonText: "SALVAR",
                        buttonIcon: "save",
                        disabled: !hasDifferences,
                        function: updateTask
                    }}
                >
                    <div className={taskStyles.contentsHolder} style={{ padding: "0.5rem" }}>
                        <div className={taskStyles.modalRow}>
                            <div className={taskStyles.column}>
                                <h3 className={menuStyles.title}>Data</h3>
                                <Calendar initialDate={taskDate} setDate={setNewDate} />
                            </div>
                            <div className={taskStyles.column} style={{ height: "initial", justifyContent: "space-between" }}>
                                <h3 className={menuStyles.title}>Detalhes</h3>
                                <ActivityTypeSelector limitType='event' defaultValue={task.type} setType={setNewTaskType} />
                                <EventTitleSelector defaultValue={task.title} setSelectedValue={setNewTitle} />
                                <EventAddressSelector defaultValue={task.address} setSelectedValue={setNewAddress} />
                            </div>
                        </div>
                        <DescriptionEditor editor={editor} />
                        <div className={'dangerZone'}>
                            <p>Zona de Perigo</p>
                            <Button
                                icon={"delete_forever"}
                                iconProps={{
                                    filled: true,
                                    size: "1.6rem"
                                }}
                                accentColor={'var(--red-02)'}
                                title='EXCLUIR ATIVIDADE'
                                style={{
                                    width: "100%",
                                    backgroundColor: "var(--red-01)",
                                    padding: "1rem 2.5rem"
                                }}
                                isLoading={isLoading}
                                onClick={() => setDeleteModalVisible(true)}
                            />
                        </div>
                    </div>
                    {ConfirmDeleteModal}
                </Modal>,
        setEditTaskModalVisible: setModalVisible
    }
}