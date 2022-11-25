import { Dispatch, FormEvent, SetStateAction, useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies';

// Components
import Sidebar from '../../components/Sidebar';
import Profile from '../../components/Profile';
import Button from '../../components/Button';

// Intro Modal Images
import Modal1Image from "/public/images/marketplace/marketplace_1.png";
import Modal2Image from "/public/images/marketplace/marketplace_2.png";

// Select Components
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectScrollDownButton, SelectSeparator, SelectViewport } from '../../components/Input/Select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

// Server Props
import getUser from '../../services/getUser';
import getUserIdByToken from '../../services/getUserIdByToken';

// Stylesheets
import styles from '../../styles/Marketplace.module.css';
import inputStyles from "../../components/Input/label.module.css";

// Types
import { User } from '../../types/User';

// Icons
import Menu from '../../components/Menu';
import { EmptyTasksMessage } from '../home';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token } = parseCookies(context)

    const userId = await getUserIdByToken(token);
    let user = null;

    if (userId) {
        user = await getUser(userId as number, "basic") as unknown as User;
    }

    if (user) {
        user.tasks.map((task, index) => {
            const date = new Date(task.date);
            task.date = Math.floor(date.getTime());
            if (task.group) {
                task.group.createdAt = Math.floor(task.group.createdAt as number);
            }
            return task;
        })

        user.groups.map((group, index) => {
            const date = new Date(group.createdAt);
            group.createdAt = Math.floor(date.getTime());

            return group;
        })
    }

    const announcementsData = await getAllAnnouncements();
    let announcements = null;

    if (announcementsData) {
        announcements = announcementsData
    }

    return {
        props: {
            user,
            announcements
        }
    }
}

import placeholder from "/public/images/event_example.png";
import Image from 'next/image';
import Modal from '../../components/Modal';
import { Switch, SwitchThumb } from '../../components/Switch';
import Input, { InputLabel } from '../../components/Input';
import { SelectIcon, SelectTrigger, SelectValue } from '../../components/Input/Select';
import { api } from '../../lib/api';
import { Separator } from '../../components/Separator';
import getAllAnnouncements from '../../services/getAllAnnouncements';
import Announcement from '../../types/Announcement';
import LandingIntroModal from '../../components/Landing/IntroModal';

function EventHeader({ hasUser }: { hasUser: boolean }) {
    return <div className={styles.marketplaceEvent}>
        <header>
            <h2>Terceirão 2022</h2>
            <div className={'row'} style={{ justifyContent: "flex-start", gap: "0.5rem" }}>
                <span className={'material-icons-outlined static'}>calendar_today</span>
                <p>até 31/03/2023</p>
            </div>
        </header>
        {/* <Button
            title='PREÇOS ORIGINAIS'
            icon={'payments'}
            style={{
                zIndex: 1,
                paddingInline: "1.25rem",
                backgroundColor: "var(--primary-02)"
            }}
        /> */}
        {/* <Button
            title='REPORTAR PROBLEMA'
            icon={'report'}
            style={{
                zIndex: 1,
                paddingInline: "1.25rem",
                backgroundColor: "var(--primary-02)"
            }}
        /> */}
        <Image priority className={styles.image} src={placeholder.src} width={hasUser ? 1000 : 2000} height={hasUser ? 1000 : 2000} alt="" />
    </div>
}

function Announcement({ userId, announcement, setContactModalState, setDeleteModalVisible, setLockModalState }:
    { userId?: number, announcement: Announcement, setContactModalState: Dispatch<SetStateAction<Announcement | undefined>>, setDeleteModalVisible: Dispatch<SetStateAction<undefined | number>>, setLockModalState: Dispatch<SetStateAction<{ id: number, state: 'locked' | 'unlocked' } | undefined>> }) {
    const [isExpanded, setExpanded] = useState(false);

    return <div id={announcement.id.toString()} className={styles.announcement}>
        <div className={`${styles.column} ${styles.first}`} style={{ alignItems: "flex-start" }}>
            <h3
                onClick={() => announcement.description.length >= 100 && setExpanded(!isExpanded)}
                className={announcement.description.length >= 100 ? styles.big : ""}
                style={isExpanded ? { display: "flex" } : {}}
            >
                {announcement.description}
            </h3>
            <div className={styles.subheader}>
                <div style={{ overflow: "hidden", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src={announcement.user.image_url} width={18} height={18} alt={"Imagem do usuário"} />
                </div>
                <p>anúncio por <strong>{announcement.user.firstName + " " + announcement.user.lastName}</strong></p>
            </div>
            <div className={styles.iconHolder}>
                <span className={'material-icons-outlined static'} style={{ fontSize: "1.5rem" }}>visibility</span>
                <p>{announcement.visualizationsCount.length} pessoa{announcement.visualizationsCount.length !== 1 ? "s" : ""} já {announcement.visualizationsCount.length !== 1 ? "visualizaram" : "visualizou"} </p>
            </div>
        </div>
        <div className={`${styles.column} ${styles.second}`} style={{ alignItems: "flex-end" }}>
            <div className={styles.row}>
                {
                    announcement.isLocked && userId ? <p style={{ fontFamily: "Karla" }}>Este anúncio foi bloqueado por você!</p> :
                        <>
                            <div className={styles.iconHolder}>
                                {
                                    announcement.materialPrice === -1 && <span className={'material-symbols-rounded static'} style={{ fontSize: "1.6rem" }}>{"volunteer_activism"}</span>
                                }
                                <p style={{ fontSize: "1.4rem" }}><strong>{announcement.materialPrice === 0 ? "Valor não informado" : announcement.materialPrice < 0 ? "Doação" : `R$${announcement.materialPrice},00`}</strong></p>
                            </div>
                            <Separator orientation="vertical" />
                            <div className={styles.iconHolder}>
                                {announcement.materialCondition !== "used" && <span className={'material-symbols-rounded static'} style={{ fontSize: "1.5rem" }}>{announcement.materialCondition === "new" ? "temp_preferences_custom" : announcement.materialCondition === "used" ? "autorenew" : "add_moderator"}</span>}
                                <p style={{ fontSize: "1.4rem", fontWeight: 600 }}>{announcement.materialCondition === "new" ? "Novo" : announcement.materialCondition === "used" ? "Usado" : "Usado e bem conservado"}</p>
                            </div>
                        </>
                }
            </div>
            <div className={styles.row} style={{ justifyContent: "flex-end", gap: "2rem" }}>
                {
                    userId && <>
                        <span onClick={() => { setLockModalState(announcement.isLocked ? { id: announcement.id, state: "locked" } : { id: announcement.id, state: "unlocked" }) }} className={`material-symbols-rounded static click ${styles.button}`} style={{ fontSize: "2.2rem" }}>{announcement.isLocked ? "lock_open" : "lock"}</span>
                        <span onClick={() => setDeleteModalVisible(announcement.id)} className={`material-symbols-rounded static click ${styles.button}`} style={{ fontSize: "2.2rem" }}>delete</span>
                    </>
                }
                <Button
                    title={userId ? "MEUS CONTATOS" : 'CONTATAR'}
                    icon={'alternate_email'}
                    iconProps={{ size: "1.8rem", color: `var(--light)` }}
                    style={{ padding: "0.65rem 1rem" }}
                    accentColor={'var(--primary-01)'}
                    classes={styles.defaultButton}
                    preset={'fillHover'}
                    onClick={() => setContactModalState(announcement)}
                />
            </div>
        </div>
        {
            announcement.isLocked && !userId && <div className={styles.lockView}>
                <span className={'material-symbols-rounded static instantFilled'}>{announcement.materialPrice === -1 ? "volunteer_activism" : "attach_money"}</span>
                <p>Os itens deste anúncio já foram {announcement.materialPrice === -1 ? "doados" : "vendidos"}!</p>
            </div>
        }
    </div >
}

// credits: https://tomduffytech.com/how-to-format-phone-number-in-javascript/

function formatPhoneNumber(value: string) {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
        2,
        7
    )}-${phoneNumber.slice(7, 11)}`;
}

function phoneNumberFormatter(id: string) {
    // grab the value of what the user is typing into the input
    const inputField = document.getElementById(id) as HTMLInputElement;

    // next, we're going to format this input with the `formatPhoneNumber` function, which we'll write next.
    const formattedInputValue = formatPhoneNumber(inputField.value);

    // Then we'll set the value of the inputField to the formattedValue we generated with the formatPhoneNumber
    inputField.value = formattedInputValue;
}

interface Data {
    userId: number;
    description: string;
    condition: number;
    price?: number;
    whatsApp?: number;
    phone?: number;
    email?: string;
}

const Marketplace = ({ user, announcements }: { user: User, announcements: Announcement[] }) => {
    const router = useRouter();

    const [announcementModalState, setAnnouncementModalState] = useState<'default' | 'success' | 'error' | ''>('');
    const [contactModalState, setContactModalState] = useState<undefined | Announcement>(undefined);

    const [isDeleteModalVisible, setDeleteModalVisible] = useState<number | undefined>(undefined);
    const [lockModalState, setLockModalState] = useState<{ id: number, state: 'locked' | 'unlocked' } | undefined>(undefined);

    const [isLoading, setLoading] = useState(false)

    const [showPrice, setShowPrice] = useState(true)
    const [showWhatsApp, setShowWhatsApp] = useState(true);

    useEffect(() => {
        if (user) {
            setAnnouncementModalState(router.query.creatorCode === "799b0a34-6f94-441a-97eb-45d7ae34d31f" ? "default" : "")
        }
    }, [])

    async function createAnnouncement(event: FormEvent<HTMLFormElement>) {
        setLoading(true)

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as unknown as Data;
        console.log(data)

        // description, condition, price, whatsApp, phone, email -- nome dos dados do back end para a query

        if (!user.id) {
            return false;
        }

        try {
            const response = await api.post('/announcements/new', {
                userId: user.id,
                description: data.description,
                condition: data.condition,
                price: showPrice ? data.price : -1,
                whatsApp: data.whatsApp,
                phone: data.phone,
                email: data.email
            })
            console.log(response.data)

            setAnnouncementModalState('success')

            setLoading(false)
        } catch (error) {
            console.log(error)
            setAnnouncementModalState('error')
            setLoading(false)
        }
    }

    function reloadPage() {
        setAnnouncementModalState("")
        router.push(`/marketplace`)
    }

    async function deleteAnnouncement() {
        setLoading(true)

        if (isDeleteModalVisible) {
            try {
                await api.delete(`/announcements/${isDeleteModalVisible}`)

                setDeleteModalVisible(undefined)
                setLoading(false)

                router.push(`/marketplace`)
            } catch (error) {
                console.log(error)
                setDeleteModalVisible(undefined)
                setLoading(false)
            }
        }
    }

    async function toggleAnnouncementLock() {
        setLoading(true)

        if (lockModalState) {
            try {
                const response = await api.patch(`/announcements/${lockModalState.id}`, { isLocked: lockModalState.state === "locked" ? false : true })
                console.log(response.data)

                setLockModalState(undefined)
                setLoading(false)
                router.push(`/marketplace`)
            } catch (error) {
                console.log(error)
                setLockModalState(undefined)
                setLoading(false)
            }
        }
    }

    async function addView() {
        if (contactModalState) {
            try {
                const response = await api.patch(`/announcements/${contactModalState.id}`, { userDeviceId: navigator.userAgent })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const alreadyRegistered = useRef(false);

    useEffect(() => {
        if (alreadyRegistered.current === false && contactModalState) {
            alreadyRegistered.current = true
            addView()
        }
    }, [contactModalState])

    const [alreadyShownModal, setAlreadyShownModal] = useState(true);

    useEffect(() => {
        const haveShown = localStorage.getItem('shownModal.2') ? true : false;
        if (!haveShown) {
            localStorage.setItem('shownModal.2', "true")
            setAlreadyShownModal(false)
        }
    }, [])

    return (
        <main>
            <Head>
                <title>Marketplace</title>
            </Head>
            <Sidebar notAuthenticated={!user} />
            <div className={`${styles.container} ${user ? "" : styles.noUser}`}>
                {user && <Profile user={user} />}
                <div className={"header"}>
                    <h3 className={"title"}>Marketplaces ativos</h3>
                </div>
                <EventHeader hasUser={user ? true : false} />
                <ul className={styles.groupHolder} style={{ paddingBottom: "5rem" }}>
                    {
                        announcements && announcements.length > 0 ? announcements.map(announcement =>
                            <Announcement
                                setContactModalState={setContactModalState}
                                setDeleteModalVisible={setDeleteModalVisible}
                                setLockModalState={setLockModalState}
                                key={announcement.id}
                                userId={user && user.id === announcement.user.id ? user.id : undefined}
                                announcement={announcement}
                            />) :
                            <EmptyTasksMessage description='Nenhum anúncio foi adicionado até o momento.' />
                    }
                </ul>
            </div>
            <Modal
                isVisible={announcementModalState !== ''}
                toggleVisibility={() => setAnnouncementModalState('')}
                icon={announcementModalState === 'default' ? "sell" :
                    announcementModalState === 'success' ? "autorenew" :
                        "remove"
                }
                iconProps={{ position: "flex-start", builtWithTitle: true, size: "2.4rem" }}
                color={`var(--primary-02)`}
                isLoading={isLoading}
                actionProps={{
                    buttonText: announcementModalState === "default" ? "CRIAR ANÚNCIO" : "RECARREGAR",
                    function: announcementModalState === "success" ?
                        () => reloadPage() :
                        undefined,
                    isForm: announcementModalState === "default" ? true : false
                }}
                style={{ color: "var(--primary-02)", fontFamily: "Inter", fontWeight: 500, paddingBottom: announcementModalState === "default" ? 0 : "2.5rem" }}
                suppressReturnButton={announcementModalState !== "default" ? true : false}
                title={announcementModalState === 'success' ? 'Eba! Deu tudo certo.' : announcementModalState === "error" ?
                    "Eita. Parece que deu ruim." : "Criar anúncio"
                }
            >
                {
                    announcementModalState === "default" ?
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                createAnnouncement(event)
                            }}
                            style={{ width: "100%", }}
                        >
                            <div className={styles.modalContent} >
                                <div className='selectHolder'>
                                    <InputLabel label='Mensagem do Anúncio *' />
                                    <textarea
                                        className={`${inputStyles.input}`}
                                        maxLength={180}
                                        name="description"
                                        placeholder={"Esta mensagem será exibida para os usuários que acessarem a página, portanto, seja o mais descritivo possível no limite de 180 caracteres."}
                                        style={{ height: "7.5rem" }}
                                    />
                                </div>
                                <div className={styles.groupHolder}>
                                    <div className='row' style={{ gap: "1.5rem" }}>
                                        <div className='selectHolder'>
                                            <InputLabel label='Estado de Conservação *' />
                                            <Select name='condition'>
                                                <SelectTrigger aria-label="activity-mode">
                                                    <SelectValue placeholder="Selecionar" />
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
                                                            <SelectItem value="new">
                                                                <SelectItemText>Novo</SelectItemText>
                                                                <SelectItemIndicator>
                                                                    <CheckIcon />
                                                                </SelectItemIndicator>
                                                            </SelectItem>
                                                            <SelectItem value="used">
                                                                <SelectItemText>Usado</SelectItemText>
                                                                <SelectItemIndicator>
                                                                    <CheckIcon />
                                                                </SelectItemIndicator>
                                                            </SelectItem>
                                                            <SelectItem value="preserved">
                                                                <SelectItemText>Usado e bem preservado</SelectItemText>
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
                                        {
                                            showPrice && <Input
                                                label='Preço dos Itens'
                                                name='price'
                                                maxLength={30}
                                                fixedUnit={"R$"}
                                                type="number"
                                            />
                                        }
                                    </div>
                                    <div className={styles.toggleContainer}>
                                        <InputLabel label='Os itens deste anúncio serão doados' />
                                        <Switch onCheckedChange={(checked: boolean) => setShowPrice(!checked)}>
                                            <SwitchThumb />
                                        </Switch>
                                    </div>
                                </div>
                                <h3>Informações de Contato</h3>
                                <div className={styles.groupHolder}>
                                    <div className='row' style={{ gap: "1.5rem" }}>
                                        <Input
                                            label='Telefone *'
                                            name='phone'
                                            id='phone'
                                            type="tel"
                                            onKeyDown={() => phoneNumberFormatter('phone')}
                                            required={showWhatsApp ? false : true}
                                        />
                                        {
                                            showWhatsApp && <Input
                                                label='WhatsApp'
                                                name='whatsApp'
                                                id='whatsApp'
                                                onKeyDown={() => phoneNumberFormatter('whatsApp')}
                                                type="tel"
                                            />
                                        }
                                    </div>
                                    <div className={styles.toggleContainer}>
                                        <InputLabel label='Meus número de Telefone e WhatsApp são iguais' />
                                        <Switch onCheckedChange={(checked: boolean) => setShowWhatsApp(!checked)}>
                                            <SwitchThumb />
                                        </Switch>
                                    </div>
                                    <Input
                                        label='E-mail'
                                        name='email'
                                        type="email"
                                    />
                                </div>
                            </div>
                            <div className={styles.buttonHolder}>
                                <Button
                                    title={"CRIAR ANÚNCIO"}
                                    isLoading={isLoading}
                                    icon={"sell"}
                                    iconProps={{ color: 'var(--primary-02)', filled: true }}
                                    style={{
                                        marginInline: "auto",
                                        padding: `0.7rem 1.5rem`,
                                        textTransform: "uppercase",
                                        cursor: isLoading ? "not-allowed" : "pointer"
                                    }}
                                    type="submit"
                                    accentColor={"var(--primary-02)"}
                                />
                            </div>
                        </form>
                        : announcementModalState === "success" ?
                            <>
                                <p>Agora seu anúncio está disponível para todos os usuários que visitarem o marketplace. <br />
                                    Lembre-se de <strong>marcar o anúncio</strong> caso os itens tenham sido vendidos ou doados!</p>

                            </>
                            :
                            <p>Tivemos um problema interno e não foi possível criar seu anúncio. Pedimos a você que tente novamente e entre em contato conosco caso o problema persista.</p>
                }
            </Modal>
            <Modal
                icon={'alternate_email'}
                isVisible={contactModalState ? true : false}
                toggleVisibility={() => setContactModalState(undefined)}
                color={"var(--primary-02)"}
                suppressReturnButton
                iconProps={{ position: "flex-start", size: '3.2rem' }}
            >
                {
                    contactModalState &&
                    <div className={styles.contentsHolder}>
                        {
                            contactModalState.whatsAppNumber && <div className={styles.content}>
                                <div className={styles.header}>
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.0138 2.33325C7.59017 2.33325 2.36089 7.55802 2.35856 13.9817C2.35739 16.035 2.89521 18.0396 3.91488 19.8059L2.3335 25.6666L8.43799 24.2242C10.1402 25.1529 12.0563 25.6404 14.007 25.6415H14.0116C20.4341 25.6415 25.6611 20.4156 25.6646 13.9931C25.6669 10.8792 24.456 7.95161 22.2557 5.74894C20.0554 3.54744 17.1312 2.33442 14.0138 2.33325ZM14.0116 4.66659C16.5036 4.66775 18.8455 5.63935 20.606 7.39868C22.3665 9.16035 23.3335 11.5011 23.3312 13.9908C23.3289 19.1288 19.1496 23.3082 14.0093 23.3082C12.4541 23.307 10.9136 22.9165 9.5568 22.1757L8.77067 21.7473L7.90251 21.9524L5.60563 22.4947L6.16618 20.412L6.41911 19.4778L5.93603 18.6392C5.1217 17.2299 4.69073 15.6185 4.69189 13.9817C4.69423 8.84602 8.87472 4.66659 14.0116 4.66659ZM9.88949 8.60409C9.69465 8.60409 9.37963 8.677 9.11247 8.96867C8.8453 9.25917 8.09163 9.96276 8.09163 11.3954C8.09163 12.8281 9.13525 14.213 9.28109 14.4078C9.42575 14.6015 11.2955 17.6344 14.2554 18.801C16.7147 19.7705 17.2142 19.5792 17.7485 19.5302C18.2829 19.4824 19.4723 18.8272 19.715 18.1471C19.9577 17.4669 19.9582 16.8818 19.8859 16.7616C19.8136 16.6403 19.6193 16.568 19.3276 16.4221C19.0371 16.2763 17.6055 15.5733 17.3384 15.4765C17.0712 15.3796 16.8758 15.3306 16.6821 15.6223C16.4885 15.914 15.9319 16.568 15.7616 16.7616C15.5912 16.9565 15.422 16.9827 15.1304 16.8368C14.8387 16.6898 13.9009 16.3816 12.7879 15.3899C11.9223 14.6187 11.3381 13.6672 11.1678 13.3756C10.9986 13.0851 11.1519 12.9255 11.2977 12.7808C11.4284 12.6502 11.5871 12.4408 11.7329 12.2704C11.8776 12.1001 11.9277 11.9787 12.0246 11.7851C12.1214 11.5914 12.0718 11.4205 11.9995 11.2747C11.9272 11.1288 11.3607 9.69084 11.1017 9.1145C10.8836 8.63034 10.6531 8.61909 10.4455 8.61092C10.2763 8.60392 10.0832 8.60409 9.88949 8.60409Z" fill="#7642CB" />
                                    </svg>

                                    <p>WhatsApp</p>
                                </div>
                                <a href={`tel:+55${contactModalState.whatsAppNumber}`}>{contactModalState.whatsAppNumber}</a>
                            </div>
                        }
                        {
                            contactModalState.phoneNumber && <div className={styles.content}>
                                <div className={styles.header}>
                                    <span className={'material-symbols-rounded static'}>phone</span>
                                    <p>Telefone</p>
                                </div>
                                <a href={`tel:+55${contactModalState.phoneNumber}`}>{contactModalState.phoneNumber}</a>
                            </div>
                        }
                        {
                            contactModalState.email && <div className={styles.content}>
                                <div className={styles.header}>
                                    <span className={'material-symbols-rounded static'}>email</span>
                                    <p>E-mail</p>
                                </div>
                                <a href={`mailto:${contactModalState.email}`}>{contactModalState.email}</a>
                            </div>
                        }
                    </div>
                }
            </Modal>
            <Modal
                isVisible={isDeleteModalVisible !== undefined}
                toggleVisibility={() => setDeleteModalVisible(undefined)}
                title='Tem certeza que você quer deletar este anúncio?'
                description="Esta ação é permanente."
                color='var(--primary-02)'
                icon='delete'
                isLoading={isLoading}
                actionProps={{
                    buttonText: "DELETAR",
                    function: () => deleteAnnouncement(),
                }}
            />
            <Modal
                isVisible={lockModalState !== undefined}
                toggleVisibility={() => setLockModalState(undefined)}
                title={`Tem certeza que você deseja ${lockModalState?.state === "locked" ? "destravar" : "travar"} este anúncio?`}
                description={lockModalState?.state === "locked" ? "Este anúncio voltará a aparecer como disponível na plataforma." : "Este anúncio aparecerá como vendido ou doado na lista de anúncios da plataforma."}
                color='var(--primary-02)'
                icon={lockModalState?.state === "locked" ? "lock_open" : 'lock'}
                isLoading={isLoading}
                actionProps={{
                    buttonText: lockModalState?.state === "locked" ? "DESTRAVAR" : "TRAVAR",
                    function: () => toggleAnnouncementLock(),
                }}
            />
            {
                user && <Menu />
            }
            {
                !alreadyShownModal &&
                <LandingIntroModal sections={[
                    {
                        title: 'Bem-vindo ao estudaí marketplace',
                        description: "Acompanhe diferentes marketplaces selecionados repletos de itens para seu novo ano letivo.",
                        image_path: Modal1Image,
                        imageSize: { height: 175, width: 400 }
                    },
                    {
                        title: 'Encontre aquilo que você precisa',
                        description: "Saiba a margem de preço e o estado de conservação dos itens que estão sendo vendidos, e caso goste de algo, contate o anunciante por meio dos contatos.",
                        image_path: Modal2Image,
                        imageSize: { height: 165, width: 400 }
                    },
                ]} />
            }
        </main>
    )
}

export default Marketplace;
