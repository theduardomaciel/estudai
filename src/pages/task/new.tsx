import { FormEvent, SetStateAction, useEffect, useRef, useState, Dispatch, MutableRefObject } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

// Stylesheets
import styles from '../../styles/CreateTask.module.css';
import inputStyles from "../../components/Input/label.module.css";

// Components
import Sidebar from '../../components/Sidebar';
import Navigator from '../../components/Navigator';
import Section from '../../components/Section';
import Input, { InputLabel } from '../../components/Input';
import Calendar from '../../components/Calendar';
import Menu from '../../components/Menu';
import Button from '../../components/Button';
import UsersPortraits from '../../components/UsersPortraits';
import AttachmentsLoader from '../../components/AttachmentLoader';
import Modal from '../../components/Modal';
import SubjectsSelector from '../../components/SubjectsSelector';
import { isActivity, isTest, taskGroupType } from '../../components/Task';
import SubjectsModalPreset from '../../components/Modal/Presets/SubjectsModal';
import CustomEditor from '../../components/Editor';

// Select Components
import { Select, SelectContent, SelectGroup, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectLabel, SelectScrollDownButton, SelectSeparator, SelectTrigger, SelectValue, SelectViewport } from '../../components/Input/Select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

// Types
import { Attachment } from '../../types/Attachment';
import { Contents, TaskMode, TaskType } from '../../types/Task';
import { Group } from '../../types/Group';

// Editor
import { useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

// Services
import { useAppContext } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { Subject } from '../../types/Subject';
import NewSubjectModalPreset from '../../components/Modal/Presets/NewSubjectModal';
import Translate, { TranslateText } from '../../components/Translate';

interface TaskData {
    type: string;
    mode: string;
    maxScore: number;
    questionsAmount: number;
    subject: string;
    title: string;
    address: string;
}

export const ActivityTypeSelector = ({ limitType, setType, defaultValue }: { limitType?: 'activity' | 'test' | 'event', defaultValue?: string, setType?: Dispatch<SetStateAction<TaskType>> }) => {
    const typesData = {
        activity: [
            {
                name: `${TranslateText("Obligatory")} (AV3)`,
                value: 'obligatory',
            },
            {
                name: `${TranslateText("Elective")}`,
                value: 'elective',
            },
        ],
        test: [
            {
                name: `${TranslateText("Test 1")} (AV1)`,
                value: 'av1',
            },
            {
                name: `${TranslateText("Test 2")} (AV2)`,
                value: 'av2',
            },
        ],
        event: [
            {
                name: `${TranslateText("Event")}`,
                value: 'event',
            },
        ]
    }

    return (
        <div className={"selectHolder"}>
            <InputLabel label={TranslateText("Which is the type of the activity?")} />
            <Select name='type' onValueChange={(value) => setType && setType(value as any)} defaultValue={defaultValue ? defaultValue : 'obligatory'}>
                <SelectTrigger aria-label="activity-type">
                    <SelectValue placeholder={TranslateText("Select the type of activity")} />
                    <SelectIcon>
                        <ChevronDownIcon />
                    </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                    <SelectScrollDownButton>
                        <ChevronUpIcon />
                    </SelectScrollDownButton>
                    <SelectViewport>
                        {
                            limitType === "activity" || limitType === undefined ?
                                <>
                                    <SelectGroup>
                                        <SelectLabel><Translate>Activities</Translate></SelectLabel>
                                        {(Object.entries(typesData.activity) as Array<any>).map(([index, data]) => {
                                            return (
                                                <SelectItem key={index.toString()} value={data.value}>
                                                    <SelectItemText >
                                                        {data.name}
                                                    </SelectItemText>
                                                    <SelectItemIndicator>
                                                        <CheckIcon />
                                                    </SelectItemIndicator>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                    {
                                        limitType === undefined ? <SelectSeparator /> : <></>
                                    }
                                </>
                                : <></>
                        }
                        {
                            limitType === "test" || limitType === undefined ?
                                <>
                                    <SelectGroup>
                                        <SelectLabel><Translate>Tests</Translate></SelectLabel>
                                        {(Object.entries(typesData.test) as Array<any>).map(([index, data]) => {
                                            return (
                                                <SelectItem key={index.toString()} value={data.value}>
                                                    <SelectItemText >
                                                        {data.name}
                                                    </SelectItemText>
                                                    <SelectItemIndicator>
                                                        <CheckIcon />
                                                    </SelectItemIndicator>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                    {
                                        limitType === undefined ? <SelectSeparator /> : <></>
                                    }
                                </>
                                : <></>
                        }
                        {
                            limitType === "event" || limitType === undefined ?
                                <>
                                    <SelectGroup>
                                        <SelectLabel><Translate>Electives</Translate></SelectLabel>
                                        {(Object.entries(typesData.event) as Array<any>).map(([index, data]) => {
                                            return (
                                                <SelectItem key={index.toString()} value={data.value}>
                                                    <SelectItemText >
                                                        {data.name}
                                                    </SelectItemText>
                                                    <SelectItemIndicator>
                                                        <CheckIcon />
                                                    </SelectItemIndicator>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </>
                                : <></>
                        }
                    </SelectViewport>
                    <SelectScrollDownButton>
                        <ChevronDownIcon />
                    </SelectScrollDownButton>
                </SelectContent>
            </Select>
        </div>
    )
}

export const ActivityModeSelector = ({ defaultValue, setSelectedValue }: { defaultValue?: string, setSelectedValue?: Dispatch<SetStateAction<TaskMode>> }) => <div className={"selectHolder"}>
    <InputLabel label={TranslateText("How the activity should be done?")} />
    <Select name='mode' defaultValue={defaultValue ? defaultValue : 'free'} onValueChange={(value) => setSelectedValue && setSelectedValue(value as any)}>
        <SelectTrigger aria-label="activity-mode">
            <SelectValue placeholder={TranslateText("Select how it should be done")} />
            <SelectIcon>
                <ChevronDownIcon />
            </SelectIcon>
        </SelectTrigger>
        <SelectContent>
            <SelectScrollDownButton>
                <ChevronUpIcon />
            </SelectScrollDownButton>
            <SelectViewport>
                <SelectGroup>
                    {/* <SelectLabel>Atividades</SelectLabel> */}
                    <SelectItem value="written">
                        <SelectItemText><Translate>Written</Translate></SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="typed">
                        <SelectItemText><Translate>Typed</Translate></SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="both">
                        <SelectItemText><Translate>Written or typed</Translate></SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="online">
                        <SelectItemText>On-line</SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="free">
                        <SelectItemText><Translate>No restriction</Translate></SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                </SelectGroup>
            </SelectViewport>
            <SelectScrollDownButton>
                <ChevronDownIcon />
            </SelectScrollDownButton>
        </SelectContent>
    </Select>
</div>

export const SubjectSelector = ({ userSubjects, defaultSubjects, defaultValue, setSelectedValue }:
    { userSubjects: Subject[] | undefined, defaultSubjects: Subject[] | undefined, defaultValue?: string, setSelectedValue?: Dispatch<SetStateAction<Array<Subject>>> }) => <div className={"selectHolder"}>
        <InputLabel label={TranslateText("What is the subject of the activity?")} />
        <Select
            name='subject'
            defaultValue={defaultValue && defaultValue}
            onValueChange={(value) => {
                const searchOnUserSubjects = userSubjects?.find(subject => subject.id === value) as Subject;
                const searchOnDefaultSubjects = defaultSubjects?.find(subject => subject.id === value) as Subject;
                if (setSelectedValue && searchOnUserSubjects || setSelectedValue && searchOnDefaultSubjects) {
                    setSelectedValue([searchOnUserSubjects ? searchOnUserSubjects : searchOnDefaultSubjects])
                }
            }}
        >
            <SelectTrigger aria-label="subject">
                <SelectValue placeholder={TranslateText("Select the subject of the activity")} />
                <SelectIcon>
                    <ChevronDownIcon />
                </SelectIcon>
            </SelectTrigger>
            <SelectContent>
                <SelectScrollDownButton>
                    <ChevronUpIcon />
                </SelectScrollDownButton>
                <SelectViewport>
                    <SelectGroup>
                        <SelectItem key={'empty'} value={'-1'}>
                            <SelectItemText>
                                <span className='material-symbols-rounded' style={{ fontSize: "1.6rem", marginRight: "1rem" }}>block</span>
                                <Translate>No subject</Translate>
                            </SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectSeparator />

                        {
                            userSubjects && userSubjects.length > 0 ?
                                <>
                                    <SelectGroup>
                                        <SelectLabel><Translate>Your subjects</Translate></SelectLabel>
                                        {(Object.entries(userSubjects) as Array<any>).map(([index, subject]) => {
                                            return (
                                                <SelectItem key={index.toString()} value={subject.id}>
                                                    <SelectItemText>
                                                        <span className='material-symbols-rounded' style={{ fontSize: "1.6rem", marginRight: "1rem" }}>{subject.icon}</span>
                                                        {subject.name}
                                                    </SelectItemText>
                                                    <SelectItemIndicator>
                                                        <CheckIcon />
                                                    </SelectItemIndicator>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                    <SelectSeparator /> : <></>
                                </>
                                : <></>
                        }

                        {
                            defaultSubjects && defaultSubjects.length > 0 ?
                                <>
                                    <SelectGroup>
                                        <SelectLabel><Translate>Other subjects</Translate></SelectLabel>
                                        {(Object.entries(defaultSubjects) as Array<any>).map(([index, subject]) => {
                                            return (
                                                <SelectItem key={index.toString()} value={subject.id}>
                                                    <SelectItemText>
                                                        <span className='material-symbols-rounded' style={{ fontSize: "1.6rem", marginRight: "1rem" }}>{subject.icon}</span>
                                                        <Translate>{subject.name}</Translate>
                                                    </SelectItemText>
                                                    <SelectItemIndicator>
                                                        <CheckIcon />
                                                    </SelectItemIndicator>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                </>
                                : <></>
                        }
                    </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton>
                    <ChevronDownIcon />
                </SelectScrollDownButton>
            </SelectContent>
        </Select>
    </div>

export const MaxScoreSelector = ({ defaultValue, setSelectedValue }: { defaultValue?: string, setSelectedValue?: Dispatch<SetStateAction<number | undefined>> }) => <Input
    height={"4.2rem"}
    type="number"
    onChange={(event) => setSelectedValue && setSelectedValue(parseInt(event.currentTarget.value) ? parseInt(event.currentTarget.value) : undefined)}
    numberControl
    label={TranslateText("What is the maximum amount of points that can be acquired?")}
    placeholder={defaultValue ? defaultValue : '10'}
    fixedUnit='points'
/>

export const QuestionsAmountSelector = ({ defaultValue, setSelectedValue }: { defaultValue?: string, setSelectedValue?: Dispatch<SetStateAction<number | undefined>> }) => <Input
    height={"4.2rem"}
    type="number"
    onChange={(event) => setSelectedValue && setSelectedValue(parseInt(event.currentTarget.value))}
    name='questionsAmount'
    label={TranslateText("How many questions will the test have?")}
    placeholder={defaultValue ? defaultValue : '90'}
    fixedUnit='questões'
/>

export const EventTitleSelector = ({ defaultValue, setSelectedValue }: { defaultValue?: string, setSelectedValue?: Dispatch<SetStateAction<string | undefined>> }) => <Input
    style={{ height: "4.2rem" }}
    type="text"
    onChange={(event) => setSelectedValue && setSelectedValue(event.currentTarget.value)}
    name='title'
    numberControl
    label={TranslateText("How the event should be called?")}
    defaultValue={defaultValue}
    placeholder={defaultValue ? defaultValue : TranslateText("Insert the name of the event")}
/>

export const EventAddressSelector = ({ defaultValue, setSelectedValue }: { defaultValue?: string, setSelectedValue?: Dispatch<SetStateAction<string | undefined>> }) => <Input
    style={{ height: "4.2rem" }}
    name='address'
    type={'text'}
    onChange={(event) => setSelectedValue && setSelectedValue(event.currentTarget.value)}
    numberControl
    defaultValue={defaultValue}
    label={TranslateText("Where will the event be held?")}
    placeholder={defaultValue ? defaultValue : TranslateText("Enter an physical or online address")}
/>

export const SubjectsContentsSelector = ({ subjects, contents, stateContents, setContents }:
    { subjects: Array<Subject>, stateContents?: Contents, contents?: MutableRefObject<Contents>, setContents?: Dispatch<SetStateAction<Contents>> }) => <div
        className={`${inputStyles.input} ${styles.subjectsContent} ${styles.enforce}`}
        style={{ justifyContent: subjects.length > 0 ? "flex-start" : "center" }}>
        {
            subjects.length > 0 ?
                subjects.map((subject, index) => {
                    return <li key={subject.id} className={styles.subject}>
                        <h6>• {subject.name}</h6>
                        <input
                            type="text"
                            name=""
                            id=""
                            defaultValue={stateContents ? JSON.parse(stateContents)[subject.id] : contents?.current[subject.id]}
                            placeholder={TranslateText("Insert the contents of the test here")}
                            onChange={(event) => {
                                if (setContents && stateContents) {
                                    let copy = JSON.parse(stateContents);
                                    copy[subject.id] = event.currentTarget.value
                                    setContents(JSON.stringify(copy))
                                } else if (contents) {
                                    let contentsCopy = Object.assign(contents.current) as Contents;
                                    contentsCopy[subject.id] = event.currentTarget.value
                                    contents.current = contentsCopy;
                                }
                            }}
                        />
                    </li>
                })
                :
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "85%", textAlign: "center", fontSize: "1.4rem" }}>
                    <span className={`material-symbols-rounded static`} style={{ fontSize: "4.2rem" }}>hourglass_empty</span>
                    <p className='static'><Translate>Add subjects in this test to insert their content here!</Translate></p>
                </div>
        }
    </div>

export type SubjectsData = { defaultSubjects: Array<Subject> | undefined; userSubjects: Array<Subject> | undefined; }
export type SetSubjectsData = Dispatch<SetStateAction<SubjectsData>>

export default function NewTask() {
    const router = useRouter();

    const groups = router.query.groups ? JSON.parse(router.query.groups as string) as Group[] : null;
    const selectedGroupId = router.query.selectedGroupId;

    const { isUploading } = useAppContext();

    const [modalVisible, setModalVisible] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [creatingTask, setCreatingTask] = useState(false);

    const actualDate = new Date();
    const darkFrameRef = useRef<HTMLDivElement | null>(null);

    const [type, setType] = useState<TaskType>('obligatory');

    const initialDate = router.query.date;
    const [date, setDate] = useState(initialDate ? new Date(initialDate as string) : null);

    const [storage, setStorage] = useState(selectedGroupId ? selectedGroupId as string : "account");

    const [attachments, setAttachments] = useState<Array<Attachment>>([])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({ multicolor: true }),
        ],
        content: ``,
    })

    const [subjectsData, setSubjectsData] = useState<SubjectsData>({ defaultSubjects: undefined, userSubjects: undefined })

    useEffect(() => {
        async function getSubjects() {
            const response = await api.get(`/subjects/true`)
            if (response.status === 200) {
                console.log("Matérias obtidas com sucesso.")
                setSubjectsData({ userSubjects: response.data.userSubjects ? response.data.userSubjects : [], defaultSubjects: response.data.defaultSubjects })
            }
        }
        getSubjects()
    }, [])

    const [links, setLinks] = useState<Array<string>>([]);

    const [subjects, setSubjects] = useState<Array<Subject>>([])
    const contents = useRef<Contents>({});

    const { NewSubjectModal, setNewSubjectModalStatus } = NewSubjectModalPreset(subjectsData, setSubjectsData);
    const { SubjectsModal, setSubjectsModalVisible } = SubjectsModalPreset(subjectsData.userSubjects, subjectsData.defaultSubjects, subjects, setSubjects);

    const Header = <>
        <Section title={TranslateText("Initial Details")} />
        <ActivityTypeSelector setType={setType} />
    </>

    const type1 = <>
        <div className={styles.column}>
            {Header}
            <ActivityModeSelector />
            <MaxScoreSelector />
        </div>
        <div className={styles.column}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "2.5rem",
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <Section title={TranslateText("Subject")} />
                <Button
                    style={{ height: "100%", padding: "0px 0.65rem" }}
                    icon={'add'}
                    onClick={() => setNewSubjectModalStatus(true)}
                />
            </div>
            <SubjectSelector userSubjects={subjectsData.userSubjects} defaultSubjects={subjectsData.defaultSubjects} />
            <CustomEditor editor={editor} />
        </div>
        {NewSubjectModal}
    </>

    const type2 = <>
        <div className={styles.column}>
            {Header}
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "2.5rem",
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <MaxScoreSelector />
                <QuestionsAmountSelector />
            </div>
            <SubjectsSelector openModal={() => setSubjectsModalVisible(true)} subjects={subjects} setSubjects={setSubjects} />
        </div>
        <div className={styles.column}>
            <Section title={TranslateText("Contents")} />
            <SubjectsContentsSelector subjects={subjects} contents={contents} />
        </div>
    </>

    const type3 = <>
        <div className={styles.column}>
            {Header}
            <EventTitleSelector />
            <EventAddressSelector />
        </div>
        <CustomEditor editor={editor} />
    </>

    async function createTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evitar que a página seja recarregada

        const formData = new FormData(event.currentTarget);
        const taskData = Object.fromEntries(formData.entries()) as unknown as TaskData;

        console.log(taskData, date, storage, attachments, subjects, contents.current)

        if (isUploading) {
            console.log('Um arquivo ainda está sendo enviado. Impedindo que o usuário avance.')
            if (darkFrameRef.current) {
                darkFrameRef.current.classList.toggle(styles.uploading)
                setTimeout(() => {
                    if (darkFrameRef.current) {
                        darkFrameRef.current.classList.toggle(styles.uploading)
                    }
                }, 2000);
            }
        } else {
            if (!creatingTask) {
                const { type, mode, title, address, questionsAmount, maxScore, subject } = taskData;
                const taskSubjects = subject && subject !== "-1" ? [subject] : subjects.length > 0 ? subjects : [];

                const [isActivity, isTest] = taskGroupType(type);

                const editorContent = editor?.getHTML()

                if (isActivity) {
                    if (!subject) {
                        return setErrorMessage(TranslateText("Please enter the subject of the activity!"))
                    }
                }

                if (isTest) {
                    if (subjects.length < 1) {
                        return setErrorMessage(TranslateText("Please enter at least one subject in the test!"))
                    }
                    if (!date) {
                        return setErrorMessage(TranslateText("Hey! Don't forget to mark the task date on the calendar!"))
                    }
                }

                if (type === 'event') {
                    if (!title) {
                        return setErrorMessage(TranslateText("Please enter a title for the event!"))
                    }
                    if (!date) {
                        return setErrorMessage(TranslateText("Hey! Don't forget to mark the event date on the calendar!"))
                    }
                }

                setCreatingTask(true)
                setModalVisible('upload')

                const data = {
                    type: type,
                    date: date,
                    mode: mode,
                    storage: storage,
                    contents: contents.current,
                    description: editorContent && editorContent.length > 7 ? editorContent : null,
                    title: title,
                    address: address,
                    links: links.length > 0 ? links : null,
                    attachments: attachments.length > 0 ? attachments : null,
                    subjects: taskSubjects,
                    questionsAmount: isTest && questionsAmount ? questionsAmount : 90,
                    maxScore: isTest || isActivity && maxScore ? maxScore : 10,
                }

                console.log(data)

                try {
                    const response = await api.post('/tasks/new', data)
                    console.log(response.data)

                    if (response.status === 200) {
                        console.log("Atividade criada com sucesso.", response.data)
                        setCreatingTask(false)
                        setModalVisible(response.data.id)
                    }
                } catch (error) {
                    console.log(error)

                    setModalVisible("")
                    setCreatingTask(false)
                    setErrorMessage(TranslateText("Unfortunately, a problem that occurred during the process of creating your task prevented us from creating it.:(\nPlease try again later."))
                }
            }
        }
    }

    const title = `${TranslateText("Add")} ${isActivity(type) ? TranslateText("activity") : isTest(type) ? TranslateText("test") : TranslateText("event")}`

    const [groupVisible, setGroupVisible] = useState(0);

    const groupElement = groups && groups.length > 0 && <li
        key={groupVisible}
        className={`${styles.group} click ${storage === groups[groupVisible].id.toString() ? styles.selected : ''}`}
        onClick={() => setStorage(groups[groupVisible].id.toString())}
    >
        <div className={'header'}>
            <h3 style={{ color: "var(--light)" }}>{groups[groupVisible].name}</h3>
            <UsersPortraits imagesUrls={groups[groupVisible].users.map((user, i) => user.image_url)} />
            {storage === groups[groupVisible].id.toString() && <span className={`${styles.checkCircle} material-symbols-rounded`}>check_circle</span>}
        </div>
    </li>

    return (
        <form className={styles.holder} onSubmit={createTask}>
            <Head>
                <title>{title}</title>
            </Head>
            <Sidebar />
            <div className={styles.container} >
                <Navigator directory={title} />
                <div className={styles.basicInfo}>
                    {
                        isActivity(type) ?
                            type1
                            : isTest(type) ?
                                type2
                                : type3
                    }
                </div>
                <AttachmentsLoader
                    attachments={attachments}
                    setAttachments={setAttachments}
                    style={{ paddingBottom: "3.5rem" }}
                    links={links}
                    setLinks={setLinks}
                />
            </div>
            <Menu flex>
                <div className={styles.section}>
                    <div className='row'>
                        <h3><Translate>Select date</Translate></h3>
                    </div>
                    <Calendar setDate={setDate} hasMonthSelector initialDate={date !== null ? date : undefined} />
                </div>

                <div className={styles.section}>
                    <div className='row'>
                        <h3><Translate>Select where to add</Translate></h3>
                    </div>
                    <Button
                        icon={'person'}
                        title={TranslateText("My Account")}
                        onClick={() => setStorage('account')}
                        style={{
                            width: "100%",
                            borderRadius: "0.7rem",
                            justifyContent: "flex-start",
                            paddingLeft: "2rem",
                            backgroundColor: storage === 'account' ? "var(--primary-02)" : "var(--primary-03)",
                            outline: storage === 'account' ? "2px solid var(--primary-03)" : "none"
                        }}
                        isSelected={storage === "account"}
                    >
                        {
                            storage === 'account' && <span className={`${styles.checkCircle} material-symbols-rounded`}>check_circle</span>
                        }
                    </Button>
                    <div className={styles.section} style={{ gap: "0.5rem" }}>
                        {
                            groups && groups.length > 0 ?
                                <>
                                    <h6><Translate>Groups</Translate></h6>
                                    {
                                        groups.length === 0 ?
                                            <div className={styles.noGroupWarning}>
                                                <p><Translate>You are not part of any groups yet!</Translate></p>
                                            </div> :
                                            <>
                                                <div className={styles.groups}>
                                                    {groupElement}
                                                    {
                                                        groups.length > 1 &&
                                                        <div className={`${styles.groupsIndicator} row`}>
                                                            <span onClick={() => {
                                                                if (groupVisible > 0) {
                                                                    setGroupVisible(groupVisible - 1)
                                                                }
                                                            }} className={`material-symbols-rounded`}>chevron_left</span>
                                                            <div className={styles.dots}>
                                                                {
                                                                    groups.map((group, i) => <div
                                                                        key={i}
                                                                        className={groupVisible === i ? styles.selected : ""}
                                                                        onClick={() => setGroupVisible(i)}
                                                                    />)
                                                                }
                                                            </div>
                                                            <span onClick={() => {
                                                                if (groupVisible < groups.length - 1) {
                                                                    setGroupVisible(groupVisible + 1)
                                                                }
                                                            }} className={`material-symbols-rounded`}>chevron_right</span>
                                                        </div>
                                                    }
                                                </div>
                                            </>
                                    }
                                </>
                                : null
                        }
                    </div>
                </div>
                <Button icon={"send"} title={TranslateText("Create activity")} preset="sendForm" style={{ width: "100%" }} />
            </Menu>
            <div ref={darkFrameRef} className={`${styles.darkFrame}`}></div>
            <Modal
                isVisible={modalVisible === 'upload' || typeof modalVisible === "number"}
                color={`var(--primary-02)`}
                icon={'cloud_upload'}
                toggleVisibility={() => { modalVisible === "upload" ? setModalVisible('') : "upload" }}
                suppressReturnButton
                actionProps={{
                    buttonText: TranslateText("Open"),
                    function: () => router.push(`/task/${modalVisible}`)
                }}
                isLoading={creatingTask}
                title={creatingTask ? TranslateText("Almost there!") : `${TranslateText("Task created")}!}`}
                description={creatingTask ? TranslateText("Estamos apertando uns botões e enviando alguns dados para criar sua nova tarefa.\nEspera um pouco!") : TranslateText("We're ready! The activity has been created :)")}
            />
            <Modal
                isVisible={errorMessage !== ''}
                color={`var(--primary-02)`}
                icon={'gpp_bad'}
                toggleVisibility={() => { setErrorMessage('') }}
                title={TranslateText("Oops... We were unable to create your task.")}
                description={errorMessage}
            >
            </Modal>
            {SubjectsModal}
        </form>
    )
}

{/* <p>Subgrupos</p>
                                    <ul style={{ width: "100%" }}>
                                        <Button
                                            icon={'groups_2'}
                                            title='Oficina de Redação'
                                            style={{
                                                width: "100%",
                                                padding: "0.5rem 1.5rem",
                                                borderRadius: "0.5rem",
                                                border: "0.5px solid #FFFFFF",
                                                fontFamily: "Raleway"
                                            }}
                                        />
                                    </ul> */}