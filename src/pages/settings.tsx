import { useState } from 'react';
import Head from 'next/head';
import type { NextPage } from 'next'

// Stylesheets
import styles from '../styles/Settings.module.css'

// Components
import Sidebar from '../components/Sidebar';
import Navigator from '../components/Navigator';
import SettingCard from '../components/Settings/Card';

type sections = 'account' | 'connections' | 'preferences' | 'personalization' | 'language';

const Settings: NextPage = () => {
    const [section, setSection] = useState<sections>('account')

    const ConnectionsSection = <div className={styles.mainSection}>
        <SettingCard
            title={`Seu nome`}
            description={`Insira seu nome completo, ou um nome de exibição com que esteja confortável que outros vejam.`}
            footerOutro={`Por favor, utilize 32 caracteres no máximo.`}
        />
        <SettingCard
            title={`Seu avatar`}
            description={`Para editar seu avatar, selecione um dos disponíveis abaixo ou insira um código de cor no formato HEX.`}
            footerOutro={`Para possuir uma imagem como avatar, conecte sua conta Google na plataforma.`}
        />
        <SettingCard
            title={`Excluir conta`}
            description={`Remova permanentemente sua conta pessoal e todo o seu conteúdo da plataforma. Esta ação não é reversível, portanto, continue por sua conta e risco.`}
            footerButtonText="Excluir Conta"
            buttonIcon='delete_forever'
            footerStyle={styles.deleteFooter}
        />
    </div>

    const Sections = {
        account: ConnectionsSection,
        connections: <div></div>,
        preferences: <div></div>,
        personalization: <div></div>,
        language: <div></div>,
    }

    return (
        <main>
            <Head>
                <title>Configurações</title>
            </Head>
            <Sidebar />
            <div className={styles.container}>
                <Navigator directory='Configurações' suppressBackButton />
                <div className={styles.configs}>
                    <div className={styles.menu}>
                        <span className={`material-symbols-rounded click ${styles.icon}`}>chevron_left</span>
                        <ul className={styles.sections}>
                            <li onClick={() => setSection('account')} className={`${styles.section} ${section === "account" ? styles.selected : ""}`}>Conta</li>
                            <li onClick={() => setSection('connections')} className={`${styles.section} ${section === "connections" ? styles.selected : ""}`}>Conexões</li>
                            <li onClick={() => setSection('preferences')} className={`${styles.section} ${section === "preferences" ? styles.selected : ""}`} >Preferências</li>
                            <li onClick={() => setSection('personalization')} className={`${styles.section} ${section === "personalization" ? styles.selected : ""}`}>Personalização</li>
                            <li onClick={() => setSection('language')} className={`${styles.section} ${section === "language" ? styles.selected : ""}`}>Idioma</li>
                            <li className={styles.section} style={{ color: "var(--red-01)" }}>Sair</li>
                        </ul>
                        <span className={`material-symbols-rounded click ${styles.icon}`}>chevron_right</span>
                    </div>
                    {Sections[section]}
                </div>
            </div>
        </main>
    )
}

export default Settings
