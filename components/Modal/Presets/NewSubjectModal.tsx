import React, { useState, Dispatch, SetStateAction } from 'react';

// Components
import Modal from '..';
import Button from '../../Button';
import Input from '../../Input';
import IconPickerModalPreset from './IconPickerModal';

import { api } from '../../../../lib/api';

// Types
import { SetSubjectsData, SubjectsData } from '../../../../old_pages/task/new';
import { TranslateText } from '../../Translate';

/* interface SubjectInfo {
    name: string;
    icon: string;
} */

const defaultIcon = "donut_large"

export default function NewSubjectModalPreset(previousSubjectsData?: SubjectsData, setSubjectsData?: SetSubjectsData) {
    const [modalStatus, setModalStatus] = useState<boolean | string>(false)
    const [isLoading, setLoading] = useState(false)

    const [newSubjectIcon, setNewSubjectIcon] = useState<string>(defaultIcon);
    const [newSubjectName, setNewSubjectName] = useState("");

    const { IconPickerModal, setIconPickerModalVisible } = IconPickerModalPreset(setNewSubjectIcon);

    async function CreateNewSubject() {
        setLoading(true)

        try {
            const response = await api.post(`/subjects`, { name: newSubjectName, icon: newSubjectIcon })
            if (response.status === 200) {
                console.log("Matéria criada com sucesso.")
                if (previousSubjectsData && setSubjectsData) {
                    let subjectsDataCopy = Object.assign(previousSubjectsData) as SubjectsData
                    if (subjectsDataCopy.userSubjects) {
                        subjectsDataCopy.userSubjects.push(response.data)
                        setSubjectsData(subjectsDataCopy)
                        console.log("Matérias atualizadas com sucesso.")
                    }
                }
                setModalStatus("success")
            }
            setLoading(false)
            setModalStatus("success")
        } catch (error) {
            setLoading(false)
            setModalStatus("error")
        }
    }

    return {
        NewSubjectModal: <Modal
            isVisible={modalStatus !== false}
            toggleVisibility={() => setModalStatus(false)}
            icon={modalStatus === true ? newSubjectIcon : modalStatus === "success" ? "add_task" : "report_problem"}
            iconProps={{ position: "flex-start", builtWithTitle: true, size: "3.8rem" }}
            color={`var(--primary-02)`}
            isLoading={isLoading}
            actionProps={{
                buttonText: TranslateText("Create new subject"),
                buttonIcon: "add",
                disabled: newSubjectName.length < 4 || newSubjectIcon === defaultIcon,
                function: modalStatus === true ? CreateNewSubject : undefined
            }}
            suppressReturnButton={modalStatus === true}
            title={modalStatus === "success" ? TranslateText("Subject created with success") : modalStatus === "error" ? TranslateText("We were unable to create your subject") : TranslateText("Create new subject")}
        >
            {
                modalStatus === true ?
                    <>
                        <Input
                            label={TranslateText("Subject name")}
                            maxLength={30}
                            type="text"
                            onChange={(event) => setNewSubjectName(event.currentTarget.value)}
                        />
                        <Button
                            title={newSubjectIcon === defaultIcon ? TranslateText("Select icon") : TranslateText("Change icon")}
                            icon={newSubjectIcon}
                            isLoading={isLoading}
                            style={{
                                width: "100%",
                                padding: "0.75rem 1.5rem"
                            }}
                            onClick={() => setIconPickerModalVisible(true)}
                        />
                        {IconPickerModal}
                    </>
                    :
                    <p style={{ color: "var(--primary-02)" }}>
                        {modalStatus === "success" ? TranslateText("Now you can select it in new tasks.") : TranslateText("Unfortunately we were unable to create your new subject.")}
                    </p>
            }
        </Modal>,
        setNewSubjectModalStatus: setModalStatus
    }
}