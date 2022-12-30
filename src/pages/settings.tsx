import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Head from 'next/head';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { parseCookies, setCookie } from 'nookies';

// Stylesheets
import styles from '../styles/Settings.module.css'

// Components
import Sidebar from '../components/Sidebar';
import Navigator from '../components/Navigator';
import SettingCard from '../components/Settings/Card';
import Input from '../components/Input';
import LogoutModalPreset from '../components/Modal/Presets/LogoutModal';
import { EmptyTasksMessage } from './home';

import { Select, SelectContent, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectScrollDownButton, SelectTrigger, SelectValue, SelectViewport } from '../components/Input/Select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

import { useRouter } from 'next/router';
import Translate, { TranslateText } from '../components/Translate';

import getUser from '../services/getUserByToken';
import { User } from '../types/User';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

type sections = 'account' | 'connections' | 'preferences' | 'personalization' | 'language';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['estudai.token']: token } = parseCookies(context)

    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=59'
    )

    const serverUser = await getUser(token, false, false) as unknown as User;

    return {
        props: {
            serverUser
        }
    }
}

export default function Settings({ serverUser }: { serverUser: User }) {
    const router = useRouter();
    const { signOut } = useAuth();
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    const [user, setUser] = useState<User>(serverUser)

    useEffect(() => {
        setMounted(true)
    }, [])

    const [section, setSection] = useState<sections>('account')

    const message = <EmptyTasksMessage description={TranslateText("We are still working on this feature, so this feature will only be available after a future update.")} />

    const [deleteModalState, setDeleteModalState] = useState<boolean | "pending" | "error">(false)
    async function deleteAccount() {
        setDeleteModalState("pending")

        try {
            await api.delete(`/users/${user.id}`)
            await signOut()
        } catch (error) {
            console.log(error)
            setDeleteModalState("error")
        }
    }


    async function updateAccount(setLoading: Dispatch<SetStateAction<boolean>>, { avatar, name }: { avatar?: string, name?: string }) {
        setLoading(true)
        console.log("foi")

        try {
            const response = await api.patch(`/users/${user.id}`, { name: name, avatar: avatar })
            console.log(response)
            setUser(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const MAX_CHARACTER_WARNING = TranslateText("Your name must be less than 32 characters.")
    const AVATARS = ["one", "two", "three", "four", "five", "six", "seven"]

    console.log(user.avatar, `avatar_${user.avatar}`)

    const AccountSection = () => {
        const NAME = user ? user?.username || user?.firstName + " " + (user?.lastName ? user?.lastName : "") : "";
        const [isLoading, setLoading] = useState(false)
        const [newName, setNewName] = useState(NAME)

        return (
            <div className={styles.mainSection}>
                <SettingCard
                    title={TranslateText("Your name")}
                    description={TranslateText("Enter your full name, or a display name that you are comfortable for others to see.")}
                    footer={{
                        button: {
                            disabled: NAME === newName || newName.length > 32 || newName.length < 1,
                            isLoading: isLoading,
                            onClick: () => updateAccount(setLoading, { name: newName }),
                        },
                        hint: newName.length > 32 ? MAX_CHARACTER_WARNING : ""
                    }}
                >
                    <Input placeholder={NAME} onChange={(event) => setNewName(event.currentTarget.value)} value={newName} />
                </SettingCard>
                {/* <SettingCard
            title={TranslateText("Your e-mail")}
            description={TranslateText("Coming soon after the implementation of the e-mail and password authentication support.")}
        />
        <SettingCard
            title={TranslateText("Your password")}
            description={TranslateText("Coming soon after the implementation of the e-mail and password authentication support.")}
        /> */}
                <SettingCard
                    title={TranslateText("Your avatar")}
                    description={TranslateText("To edit your avatar, select one of those available below or the Google default, if you're signed in.")}
                    footer={{
                        hint: TranslateText("To have an image as an avatar, connect your Google account on the platform.")
                    }}
                >
                    <div className={styles.avatarSection}>
                        {
                            AVATARS.map((avatar, index) => <div
                                key={index.toString()}
                                className={`${styles.avatar} ${`avatar_${avatar}`} ${user.avatar === avatar ? styles.selected : ""}`}
                                onClick={() => updateAccount(setLoading, { avatar: avatar })}
                            />)
                        }
                        {
                            user?.image_url && <Image
                                src={user.image_url}
                                className={`${styles.avatar} ${user.avatar === "google" ? styles.selected : ""}`}
                                width={75}
                                height={75}
                                alt="google image"
                                onClick={() => updateAccount(setLoading, { avatar: "google" })}
                            />
                        }
                    </div>
                </SettingCard>
                <SettingCard
                    title={TranslateText("Delete account")}
                    description={TranslateText("Permanently remove your personal account and all of its content from the platform. This action is not reversible, so proceed at your own risk.")}
                    color="var(--red-01)"
                    accentColor="var(--red-02)"
                    footer={{
                        button: {
                            title: TranslateText("Delete account"),
                            icon: 'delete_forever',
                            onClick: () => setDeleteModalState(true),
                        }
                    }}
                />
            </div>
        )
    }

    const CustomizationSection = <div className={styles.mainSection}>
        <SettingCard
            title={TranslateText("Dark mode")}
            description={TranslateText("Enable dark mode to reduce eye strain and improve your experience on the platform. Remember this functionality is still in development, so it may not work as expected.")}
        >
            {
                mounted && <div className={styles.avatarSection}>
                    <div
                        className={`${styles.avatar} ${theme === "light" ? styles.selected : ""}`}
                        onClick={() => setTheme('light')}
                        style={{ background: "#FFFFFF" }}
                    />
                    <div
                        className={`${styles.avatar} ${theme === "dark" ? styles.selected : ""}`}
                        onClick={() => setTheme('dark')}
                        style={{ background: "#222222" }}
                    />
                </div>
            }
        </SettingCard>
        <SettingCard
            title={TranslateText("Main color")}
            description={TranslateText("Select the main color of all platform elements.")}
        >
            {
                mounted && <div className={styles.avatarSection}>
                    <div
                        className={`${styles.avatar} ${theme === "default" ? styles.selected : ""}`}
                        onClick={() => setTheme('default')}
                    />
                    <div
                        className={`${styles.avatar} ${theme === "red" ? styles.selected : ""}`}
                        onClick={() => setTheme('red')}
                        style={{ background: "#FF0331" }}
                    />
                    <div
                        className={`${styles.avatar} ${theme === "green" ? styles.selected : ""}`}
                        onClick={() => setTheme('green')}
                        style={{ background: "#6FCE5F" }}
                    />
                    <div
                        className={`${styles.avatar} ${theme === "blue" ? styles.selected : ""}`}
                        onClick={() => setTheme('blue')}
                        style={{ background: "#5FCEC7" }}
                    />
                    <div
                        className={`${styles.avatar} ${theme === "yellow" ? styles.selected : ""}`}
                        onClick={() => setTheme('yellow')}
                        style={{ background: "#FFC803" }}
                    />
                </div>
            }
        </SettingCard>
    </div>

    function onLanguageChange(value: string) {
        console.log(value)
        setCookie(null, 'NEXT_LOCALE', value, {
            path: '/',
            maxAge: 9999999999999,
        })
        router.replace('/settings', '/settings', { locale: value })
    }

    const LanguageSection = <form className={styles.mainSection}>
        <SettingCard
            title={TranslateText("Language")}
            description={TranslateText("Select the language you want to use in the platform.")}
        >
            <Select name='language' defaultValue={router.locale || router.defaultLocale || 'en'} onValueChange={onLanguageChange}>
                <SelectTrigger aria-label="activity-mode">
                    <SelectValue />
                    <SelectIcon>
                        <ChevronDownIcon />
                    </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                    <SelectScrollDownButton>
                        <ChevronUpIcon />
                    </SelectScrollDownButton>
                    <SelectViewport>
                        <SelectItem value="en">
                            <SelectItemText>English</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                        <SelectItem value="pt-BR">
                            <SelectItemText>Português Brasileiro</SelectItemText>
                            <SelectItemIndicator>
                                <CheckIcon />
                            </SelectItemIndicator>
                        </SelectItem>
                    </SelectViewport>
                    <SelectScrollDownButton>
                        <ChevronDownIcon />
                    </SelectScrollDownButton>
                </SelectContent>
            </Select>
        </SettingCard>
    </form>

    const Sections = {
        account: <AccountSection />,
        connections: <div className={styles.mainSection}>{message}</div>,
        preferences: <div className={styles.mainSection}>{message}</div>,
        personalization: CustomizationSection,
        language: LanguageSection,
    }

    const { setLogoutModalVisible, LogoutModal } = LogoutModalPreset();

    return (
        <main>
            <Head>
                <title>{TranslateText("Settings")}</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Navigator directory={TranslateText("Settings")} suppressBackButton />
                <div className={styles.configs}>
                    <div className={styles.menu}>
                        <span className={`material-symbols-rounded click ${styles.icon}`}>chevron_left</span>
                        <ul className={styles.sections}>
                            <li
                                onClick={() => setSection('account')}
                                className={`${styles.section} ${section === "account" ? styles.selected : ""}`}
                            >
                                <Translate>Account</Translate>
                            </li>
                            <li
                                onClick={() => setSection('connections')}
                                className={`${styles.section} ${section === "connections" ? styles.selected : ""}`}
                            >
                                <Translate>Connections</Translate>
                            </li>
                            <li
                                onClick={() => setSection('preferences')}
                                className={`${styles.section} ${section === "preferences" ? styles.selected : ""}`}
                            >
                                <Translate>Preferences</Translate>
                            </li>
                            <li
                                onClick={() => setSection('personalization')}
                                className={`${styles.section} ${section === "personalization" ? styles.selected : ""}`}
                            >
                                <Translate>Personalization</Translate>
                            </li>
                            <li
                                onClick={() => setSection('language')}
                                className={`${styles.section} ${section === "language" ? styles.selected : ""}`}
                            >
                                <Translate>Language</Translate>
                            </li>
                            <li
                                onClick={() => setLogoutModalVisible(true)}
                                className={`${styles.section} ${styles.exit}`} style={{ color: "var(--red-01)" }}
                            >
                                <Translate>Log-out</Translate>
                            </li>
                        </ul>
                        <span className={`material-symbols-rounded click ${styles.icon}`}>chevron_right</span>
                    </div>
                    {Sections[section]}
                </div>
            </div>
            {LogoutModal}
            <Modal
                isVisible={deleteModalState !== false}
                toggleVisibility={() => setDeleteModalState(false)}
                color={`var(--primary-02)`}
                icon={'delete_forever'}
                title={deleteModalState === "error" ? TranslateText("It was not possible to delete your account.") : TranslateText("Are you sure you want to delete your account?")}
                description={deleteModalState === "error" ? TranslateText("Please try again later. If the problem persists, let us know :)") : TranslateText("This action is irreversible. All your data will be lost.")}
                actionProps={{
                    buttonText: "DELETE",
                    function: deleteAccount
                }}
                isLoading={deleteModalState === "pending"}
            />
        </main>
    )
}