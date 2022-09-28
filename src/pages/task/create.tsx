import { useState } from 'react';

import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/CreateTask.module.css';
import inputStyles from "../components/Input/label.module.css";

// Components
import Sidebar from '../../components/Sidebar';
import Navigator from '../../components/Navigator';
import Section from '../../components/Section';

// Select Components
import * as LabelPrimitive from '@radix-ui/react-label';
import { Select, SelectContent, SelectGroup, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectLabel, SelectScrollDownButton, SelectSeparator, SelectTrigger, SelectValue, SelectViewport } from '../../components/Input/Select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import Input, { InputLabel } from '../../components/Input';
import Calendar from '../../components/Calendar';
import Menu from '../../components/Menu';
import FormatToolbar from '../../components/FormatToolbar';
import Button from '../../components/Button';
import UsersPortraits from '../../components/UsersPortraits';

const CreateTask: NextPage = () => {
    const ActivityType = () => <div className={styles.selectHolder}>
        <InputLabel label='Qual o tipo de atividade?' />
        <Select defaultValue='eletiva'>
            <SelectTrigger aria-label="ActivityType">
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
                        <SelectItem value="obrigatória">
                            <SelectItemText>Obrigatória {`(AV3)`}</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="eletiva">
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
                        <SelectItem value="recuperação" disabled>
                            <SelectItemText>Recuperação</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                        <SelectLabel>Estudos eletivos</SelectLabel>
                        <SelectItem value="evento" disabled>
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

    const ActivityRealization = () => <div className={styles.selectHolder}>
        <InputLabel label='Como a atividade deve ser realizada?' />
        <Select>
            <SelectTrigger aria-label="ActivityRealization">
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
                        <SelectItem value="manuscrita">
                            <SelectItemText>Manuscrita</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="digitada">
                            <SelectItemText>Digitada</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="digitadaeimpressa">
                            <SelectItemText>Digitada e impressa</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="livre">
                            <SelectItemText>Livre</SelectItemText>
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

    const Subjects = () => <div className={styles.selectHolder}>
        <InputLabel label='Qual a matéria da atividade?' />
        <Select>
            <SelectTrigger aria-label="ActivityType">
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

    return (
        <main className={styles.holder}>
            <Head>
                <title>Adicionar tarefa</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Navigator directory='Adicionar tarefa' />
                <div className={styles.basicInfo}>
                    <div className={styles.column}>
                        <Section title='Detalhes Iniciais' />
                        <ActivityType />
                        <ActivityRealization />
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
                        <Subjects />
                        <div className='header'>
                            <Section title='Descrição' />
                            <FormatToolbar />
                        </div>
                        <div contentEditable className={inputStyles.input} style={{ padding: "1.2rem 1.2rem", height: "100%" }} />
                    </div>
                </div>
                <div className={styles.column}>
                    <div className='header'>
                        <Section title='Anexos' />
                        <Button
                            classes={styles.addButton}
                            style={{ backgroundColor: "var(--primary-02)", padding: "0.5rem 1rem", fontSize: "1.6rem", border: "1px solid var(--primary-04)" }}
                            icon={"link"}
                            title='Adicionar link'
                        />
                    </div>
                    <div className={styles.attachment}>
                        <div className={styles.guide}>
                            <h6>Arraste arquivos para cá</h6>
                            <p>ou</p>
                            <Button title='Procurar' style={{ backgroundColor: "var(--light)", padding: "0.3rem 1.2rem 0.3rem 1.2rem", color: "var(--primary-03)" }} />
                        </div>
                    </div>
                </div>
            </div>
            <Menu flex isOpened={true}>
                <div className={styles.section}>
                    <div className='row'>
                        <h3>Agenda</h3>
                    </div>
                    <Calendar hasMonthSelector />
                </div>

                <div className={styles.section}>
                    <div className='row'>
                        <h3>Selecione onde irá adicionar</h3>
                    </div>
                    <Button
                        icon={'person'}
                        title='Minha Conta'
                        style={{ width: "100%", borderRadius: "0.7rem", justifyContent: "flex-start", paddingLeft: "2rem" }}
                        selected={false}
                    />
                    <div className={styles.section} style={{ gap: "0.5rem" }}>
                        <h6>Grupos</h6>
                        <div className={styles.groups}>
                            <div className={styles.group}>
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
                    </div>
                    <Button icon={"send"} title={'Enviar Atividade'} buttontype="sendForm" />
                </div>
            </Menu>
        </main>
    )
}

export default CreateTask;