import { FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';

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
import FormatToolbar from '../../components/FormatToolbar';
import Button from '../../components/Button';
import UsersPortraits from '../../components/UsersPortraits';
import AttachmentsLoader from '../../components/AttachmentLoader';
import Modal from '../../components/Modal';

// Select Components
import { Select, SelectContent, SelectGroup, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectLabel, SelectScrollDownButton, SelectSeparator, SelectTrigger, SelectValue, SelectViewport } from '../../components/Input/Select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

// Editor
import { useEditor, EditorContent } from '@tiptap/react'
import { Editor } from '@tiptap/core';

import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

// Types
import { Attachment } from '../../types/Attachment';

// Services
import { useAppContext } from '../../contexts/AppContext';
import SubjectsSelector from '../../components/SubjectsSelector';
import getSubjectInfo, { subjectsData } from '../../utils/getSubjectInfo';
import { api } from '../../lib/api';
import { isActivity, isTest } from '../../components/Task';
import formatDate from '../../utils/formatDate';
import { Group } from '../../types/Group';

interface TaskData {
    type: string;
    mode: string;
    maxScore: number;
    questionsAmount: number;
    subject: string;
    title: string;
    address: string;
}

export function toggleSubject(subjectId: number, subjects: Array<number>, setSubjects: (state: Array<number>) => SetStateAction<void>) {
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

export default function NewTask() {
    const router = useRouter();

    const groups = router.query.groups ? JSON.parse(router.query.groups as string) as Group[] : null;
    const userId = parseInt(router.query.userId as string) as number | string;

    useEffect(() => {
        if (!userId || userId === 'NaN') {
            router.push('/home');
        }
    }, [])

    const initialDate = router.query.date;

    const { isUploading } = useAppContext();

    const [modalVisible, setModalVisible] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [creatingTask, setCreatingTask] = useState(false);

    const actualDate = new Date();
    const darkFrameRef = useRef<HTMLDivElement | null>(null);

    const [type, setType] = useState('obligatory');
    const [date, setDate] = useState(initialDate ? initialDate : `${actualDate.getFullYear()}-${actualDate.getMonth() < 10 ? `0${actualDate.getMonth()}` : actualDate.getMonth()}-${actualDate.getDate()}`);
    console.log(date)
    const [storage, setStorage] = useState("account");
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

    const [subjects, setSubjects] = useState<Array<number>>([])
    const [links, setLinks] = useState<Array<string>>([]);

    const contents = useRef<Array<string>>([]);

    const subjectsContent = subjects.map((subjectId, index) => {
        const [name, icon] = getSubjectInfo(subjectId);
        return <li key={subjectId} className={styles.subject}>
            <h6>• {name}</h6>
            <input
                type="text"
                name="" id=""
                placeholder='Insira aqui os conteúdos da matéria'
                onChange={(event) => contents.current[subjectId] = event.currentTarget.value}
            />
        </li>
    })

    const subjectsList = <div className={`${inputStyles.input} ${styles.subjectsList} ${styles.reforce} click static`}>
        {
            subjectsData.map((subject, index) => <li
                key={index}
                className={`${styles.subjectFromList} ${subjects.indexOf(index) !== -1 ? styles.selected : ""}`}
                onClick={() => toggleSubject(index, subjects, setSubjects)}
            >
                <div className={styles.title}>
                    <span className={'material-symbols-rounded'}>{subject.icon}</span>
                    <p>{subject.name}</p>
                </div>
                <span className={'material-symbols-rounded'} style={{ opacity: subjects.indexOf(index) !== -1 ? 1 : 0, transition: '0.15s' }}>check_circle</span>
            </li>)
        }
    </div>

    const ActivityType = <div className={styles.selectHolder}>
        <InputLabel label='Qual o tipo de atividade?' />
        <Select name='type' onValueChange={(value) => setType(value)} defaultValue={'obligatory'}>
            <SelectTrigger aria-label="activity-type">
                <SelectValue placeholder="Selecione o tipo de atividade" />
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
                        <SelectLabel>Atividades</SelectLabel>
                        <SelectItem value="obligatory">
                            <SelectItemText>Obrigatória {`(AV3)`}</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="elective">
                            <SelectItemText>Eletiva </SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                        <SelectLabel>Avaliações</SelectLabel>
                        <SelectItem value="av1">
                            <SelectItemText>Mensal {`(AV1)`}</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="av2">
                            <SelectItemText>Bimestral {`(AV2)`}</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="recuperation" disabled>
                            <SelectItemText>Recuperação</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                        <SelectLabel>Estudos eletivos</SelectLabel>
                        <SelectItem value="event">
                            <SelectItemText>Evento</SelectItemText>
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

    const ActivityRealization = <div className={styles.selectHolder}>
        <InputLabel label='Como a atividade deve ser realizada?' />
        <Select name='mode' defaultValue='free'>
            <SelectTrigger aria-label="activity-mode">
                <SelectValue placeholder="Selecione como será realizada" />
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
                            <SelectItemText>Manuscrita</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="typed">
                            <SelectItemText>Digitada</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="both">
                            <SelectItemText>Digitada e impressa</SelectItemText>
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
                            <SelectItemText>Sem restrição</SelectItemText>
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

    const Subjects = <div className={styles.selectHolder}>
        <InputLabel label='Qual a matéria da atividade?' />
        <Select name='subject'>
            <SelectTrigger aria-label="subject">
                <SelectValue placeholder="Escolha a matéria" />
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
                        {(Object.entries(subjectsData) as Array<any>).map(([index, value]) => {
                            return (
                                <SelectItem key={index.toString()} value={index.toString()}>
                                    <SelectItemText >
                                        <span className='material-symbols-rounded' style={{ fontSize: "1.6rem", marginRight: "1rem" }}>{value.icon}</span>
                                        {value.name}
                                    </SelectItemText>
                                    <SelectItemIndicator>
                                        <CheckIcon />
                                    </SelectItemIndicator>
                                </SelectItem>
                            )
                        })}
                    </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton>
                    <ChevronDownIcon />
                </SelectScrollDownButton>
            </SelectContent>
        </Select>
    </div>

    const type1 = <>
        <div className={styles.column}>
            <Section title='Detalhes Iniciais' />
            {ActivityType}
            {ActivityRealization}
            <Input
                height={"4.2rem"}
                type="number"
                numberControl label='Qual a pontuação máxima que pode ser adquirida?'
                placeholder='0'
                fixedUnit='pontos'
            />
        </div>
        <div className={styles.column}>
            <Section title='Classificação' />
            {Subjects}
            <div className={'header'}>
                <Section classes={styles.descriptionHeader} title='Descrição' />
                <FormatToolbar editor={editor as Editor} />
            </div>
            <div className={styles.input}>
                <EditorContent className={`${inputStyles.input} ${styles.input}`} editor={editor} />
            </div>
        </div>
    </>

    const type2 = <>
        <div className={styles.column}>
            <Section title='Detalhes Iniciais' />
            {ActivityType}
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "2.5rem",
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <Input
                    height={"4.2rem"}
                    type="number"
                    numberControl
                    name='maxScore'
                    label='Qual pontuação máxima pode ser atingida?'
                    placeholder='10'
                    fixedUnit='pontos'
                />
                <Input
                    height={"4.2rem"}
                    type="number"
                    name='questionsAmount'
                    label='Quantas questões terá a avaliação?'
                    placeholder='90'
                    fixedUnit='questões'
                />
            </div>
            <SubjectsSelector openModal={() => setModalVisible('subjects')} subjects={subjects} setSubjects={setSubjects} />
        </div>
        <div className={styles.column}>
            <Section title='Conteúdos' />
            <div className={`${inputStyles.input} ${styles.subjectsContent} ${styles.enforce}`} style={{ justifyContent: subjects.length > 0 ? "flex-start" : "center" }}>
                {
                    subjects.length > 0 ?
                        subjectsContent
                        :
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "85%", textAlign: "center", fontSize: "1.4rem" }}>
                            <span className={`material-symbols-rounded static`} style={{ fontSize: "4.2rem" }}>hourglass_empty</span>
                            <p className='static'>Adicione matérias nesta avaliação para inserir o conteúdo delas aqui!</p>
                        </div>
                }
            </div>
        </div>
    </>

    const type3 = <>
        <div className={styles.column}>
            <Section title='Detalhes Iniciais' />
            {ActivityType}
            <Input
                style={{ height: "4.2rem" }}
                type="text"
                name='title'
                numberControl label='Como o evento pode ser chamado?'
                placeholder='Insira um título para o evento :)'
            />
            <Input
                style={{ height: "4.2rem" }}
                name='address'
                type={'text '}
                numberControl label='Onde o evento será realizado?'
                placeholder='Insira um endereço presencial ou link de acesso :)'
            />
        </div>
        <div className={styles.column}>
            <div className={'header'}>
                <Section classes={styles.descriptionHeader} title='Descrição' />
                <FormatToolbar editor={editor as Editor} />
            </div>
            <div className={styles.input}>
                <EditorContent className={`${inputStyles.input} ${styles.input}`} editor={editor} />
            </div>
        </div>
    </>

    async function createTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evitar que a página seja recarregada

        const formData = new FormData(event.currentTarget);
        const taskData = Object.fromEntries(formData.entries()) as unknown as TaskData;

        console.log(taskData, date, storage, attachments, subjects)

        if (isUploading) {
            console.log('Um arquivo ainda está sendo enviado. Impedindo que o usuário avance.')
            if (darkFrameRef.current) {
                darkFrameRef.current.classList.toggle(styles.uploading)
            }
        } else {
            if (!creatingTask) {
                const { type, mode, title, address, questionsAmount, maxScore, subject } = taskData;
                const singleSubject = subject ? [subject] : [];

                const editorContent = editor?.getHTML()

                if (!date) {
                    return setErrorMessage('Ei! Não se esquece de marcar a data da tarefa no calendário!')
                }

                if (type === "obligatory" || type == 'elective') {
                    if (!subject) {
                        return setErrorMessage('Por favor, insira a matéria da atividade!')
                    }
                }

                if (type === "av1" || type == 'av2') {
                    if (subjects.length < 1) {
                        return setErrorMessage('Por favor, insira pelo menos uma matéria na avaliação!')
                    }
                }

                if (type === 'event') {
                    if (!title) {
                        return setErrorMessage('Por favor, insira um título para o evento!')
                    }
                }

                setCreatingTask(true)
                setModalVisible('upload')

                const data = {
                    userId: router.query.userId,
                    type: type,
                    date: date,
                    mode: mode,
                    storage: storage,
                    contents: contents.current,
                    description: editorContent && editorContent.length > 7 ? editorContent : "",
                    title: title,
                    address: address,
                    links: links.length > 0 ? links : null,
                    attachments: attachments.length > 0 ? attachments : null,
                    subjects: subjects.length === 0 ? singleSubject : subjects,
                    questionsAmount: questionsAmount,
                    maxScore: maxScore,
                }

                console.log(data)

                try {
                    const response = await api.post('/tasks/new', data)
                    console.log(response.data)

                    setCreatingTask(false)
                    setModalVisible(response.data.id)
                } catch (error) {
                    console.log(error)

                    setCreatingTask(false)
                    setModalVisible('error')
                }
            }
        }
    }

    const title = `Adicionar ${isActivity(type) ? 'atividade' : isTest(type) ? 'avaliação' : 'evento'}`

    const [groupVisible, setGroupVisible] = useState(0);

    const groupElement = groups !== null && <li
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
        <form className={styles.holder} onSubmit={createTask} /* onChange={(event) => {
            const formData = new FormData(event.currentTarget);
            const taskData = Object.fromEntries(formData.entries()) as unknown as TaskData;

            if (taskData.type)
        }} */>
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
                    userId={userId as number}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    style={{ paddingBottom: "3.5rem" }}
                    links={links}
                    setLinks={setLinks}
                />
            </div>
            <Menu flex isOpened={true}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                    <div className={styles.section}>
                        <div className='row'>
                            <h3>Escolha o dia da tarefa</h3>
                        </div>
                        <Calendar setDate={setDate} hasMonthSelector initialDate={new Date(date as string)} />
                    </div>

                    <div className={styles.section}>
                        <div className='row'>
                            <h3>Selecione onde irá adicionar</h3>
                        </div>
                        <Button
                            icon={'person'}
                            title='Minha Conta'
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
                                groups ?
                                    <>
                                        <h6>Grupos</h6>
                                        {
                                            groups.length === 0 ?
                                                <div className={styles.noGroupWarning}>
                                                    <p>Você ainda não participa de nenhum grupo!</p>
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
                </div>
                <Button icon={"send"} title={'Enviar Atividade'} preset="sendForm" style={{ width: "100%" }} />
            </Menu>
            <div ref={darkFrameRef} className={`${styles.darkFrame}`}></div>
            <Modal
                isVisible={modalVisible === 'upload' || typeof modalVisible === "number"}
                color={`var(--primary-02)`}
                icon={'cloud_upload'}
                toggleVisibility={() => { modalVisible === "upload" ? setModalVisible('') : "upload" }}
                suppressReturnButton
                actionProps={{
                    buttonText: "ABRIR",
                    function: () => router.push(`/task/${modalVisible}`)
                }}
                isLoading={creatingTask}
                title={creatingTask ? "Quase lá!" : "Estamos prontos!"}
                description={creatingTask ? `Estamos apertando uns botões e enviando alguns dados para criar sua nova tarefa.\nEspera um pouco!` : "Pronto! A atividade foi criada :)"}
            />
            <Modal
                isVisible={modalVisible === 'error'}
                color={`var(--primary-02)`}
                icon={'gpp_bad'}
                toggleVisibility={() => { modalVisible === "error" ? setModalVisible('') : "error" }}
                title={"Ops... Não foi possível criar sua tarefa"}
                description={"Por favor, pedimos que tente novamente. Caso o problema persista, entre em contato conosco."}
            >
            </Modal>
            <Modal
                isVisible={errorMessage !== ''}
                color={`var(--primary-02)`}
                icon={'gpp_bad'}
                toggleVisibility={() => { setErrorMessage('') }}
                title={"Ops... Não foi possível criar sua tarefa"}
                description={errorMessage}
            >
            </Modal>
            <Modal
                isVisible={modalVisible === 'subjects'}
                color={`var(--primary-02)`}
                icon={'subject'}
                toggleVisibility={() => { modalVisible === "subjects" ? setModalVisible('') : "subjects" }}
                title={"Selecione as matérias da tarefa abaixo:"}
            >
                {subjectsList}
            </Modal>
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