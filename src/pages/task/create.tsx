import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'


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

// Select Components
import { Select, SelectContent, SelectGroup, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectLabel, SelectScrollDownButton, SelectSeparator, SelectTrigger, SelectValue, SelectViewport } from '../../components/Input/Select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

// Editor
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/core';


import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Attachment } from '../../types/Attachment';
import { useRouter } from 'next/router';
import DashboardModal from '../../components/Modal';

// Form
const ActivityType = <div className={styles.selectHolder}>
    <InputLabel label='Qual o tipo de atividade?' />
    <Select name='type'>
        <SelectTrigger aria-label="activity-type" defaultValue={'obligatory'}>
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
                    <SelectItem value="6" disabled>
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
    <Select name='mode'>
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
                    <SelectItem value="química">
                        <SelectItemText>Química</SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="física">
                        <SelectItemText>Física</SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="biologia">
                        <SelectItemText>Biologia</SelectItemText>
                        <SelectItemIndicator>
                            <CheckIcon />
                        </SelectItemIndicator>
                    </SelectItem>
                    <SelectItem value="matemática">
                        <SelectItemText>Matemática</SelectItemText>
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

interface TaskData {
    type: string;
    mode: string;
    maxScore: number;
    subject: string;
}

interface AttachmentsType {
    files: Array<string>,
    links: Array<string>
}

const CreateTask: NextPage = () => {
    const router = useRouter();
    const initialDate = router.query.date;

    const [date, setDate] = useState(initialDate ? initialDate : "")

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

    const [storage, setStorage] = useState("account");

    // { name: "testando", type: "doc", tags: [] }
    const [files, setFiles] = useState<Array<Attachment>>([])

    const [modalVisible, setModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);

    return (
        <form className={styles.holder} onSubmit={(event) => {
            event.preventDefault(); // evitar que a página seja recarregada

            const formData = new FormData(event.currentTarget);
            const taskData = Object.fromEntries(formData.entries()) as unknown as TaskData;

            setUploading(true)
            setModalVisible(true)

            setTimeout(() => {
                setUploading(false)
            }, 5 * 1000);
        }}>
            <Head>
                <title>Adicionar tarefa</title>
            </Head>
            <Sidebar />
            <div className={styles.container} >
                <Navigator directory='Adicionar tarefa' />
                <div className={styles.basicInfo}>
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
                </div>
                <AttachmentsLoader setAttachments={setFiles} attachments={files} style={{ paddingBottom: "3.5rem" }} />
            </div>
            <Menu flex isOpened={true}>
                <div className={styles.section}>
                    <div className='row'>
                        <h3>Escolha o dia da tarefa</h3>
                    </div>
                    <Calendar setDate={setDate} hasMonthSelector />
                </div>

                <div className={styles.section}>
                    <div className='row'>
                        <h3>Selecione onde irá adicionar</h3>
                    </div>
                    <Button
                        icon={'person'}
                        title='Minha Conta'
                        onClick={() => setStorage('account')}
                        style={{ width: "100%", borderRadius: "0.7rem", justifyContent: "flex-start", paddingLeft: "2rem" }}
                        isSelected={storage === "account"}
                    />
                    {/* <div className={styles.section} style={{ gap: "0.5rem" }}>
                        <h6>Grupos</h6>
                        <div className={styles.groups}>
                            <div className={`${styles.group} ${storage === "group" ? 'buttonSelected' : ""} click`} onClick={() => setStorage('group')}>
                                <div className={'header'}>
                                    <h3 style={{ color: "var(--light)" }}>Terceirão</h3>
                                    <UsersPortraits imagesUrls={["https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png"]} />
                                </div>
                                <p>Subgrupos</p>
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
                                </ul>
                            </div>
                        </div>
                        <div className={`${styles.groupsIndicator} row`}>
                            <span className={`material-symbols-rounded`}>chevron_left</span>
                            <div className={styles.dots}>
                                <div />
                                <div />
                            </div>
                            <span className={`material-symbols-rounded`}>chevron_right</span>
                        </div>
                    </div> */}
                </div>
                <Button icon={"send"} title={'Enviar Atividade'} preset="sendForm" />
            </Menu>
            <div className={`${styles.darkFrame} ${uploading ? styles.uploading : ""}`}></div>
            <DashboardModal
                isVisible={modalVisible}
                color={`var(--primary-02)`}
                Icon={'cloud_upload'}
                setIsVisible={setModalVisible}
                title={"Ainda não acabamos!"}
                description={`Estamos carregando os anexos carregados para o seu Drive.\nEnquanto enviamos os arquivos, você poder acompanhar o progresso de upload :)`}
            />
        </form>
    )
}

export default CreateTask;