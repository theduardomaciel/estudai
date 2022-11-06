import type { NextPage } from 'next'

import Head from 'next/head';

// Sections
import LandingHeader from '../components/Landing/Header';
import LandingFooter from '../components/Landing/Footer';

// Stylesheets
import styles from '../styles/Landing.module.css'

// Components
import Note from '../components/Landing/Note';
import Button from '../components/Button';

const PolicyOfPrivacy: NextPage = () => {
    return (
        <main className={styles.holder}>
            <Head>
                <title>estudaí</title>
            </Head>
            <LandingHeader />
            <div className={styles.container} style={{ justifyContent: "center", marginBottom: "6.5rem" }}>
                <Note showOnlyInMobile tag='ALPHA' />
                <div className={styles.title} style={{ maxWidth: "65%" }}>
                    <h2>Ainda não estamos nesse nível, pode ficar tranquilo.</h2>
                    <p>Nosso objetivo aqui é lhe ajudar, por isso, <strong>não coletamos informações sensíveis.</strong></p>
                    <p>As únicas informações que coletamos são as <strong>estritamente necessárias</strong> para o funcionamento da aplicação, tais quais:</p>
                    <ul>
                        <li>Nome</li>
                        <li>Endereço de e-mail</li>
                        <li>Imagem de perfil</li>
                    </ul>
                    <p>Em relação a permissões e escopos de sua conta Google, somente requeremos a permissão para a criação de arquivos em sua conta, haja vista que tal acesso é necessário para a criação de anexos em suas tarefas.</p>
                    <p>- estudaí 💜</p>
                </div>
            </div>
        </main>
    )
}

export default PolicyOfPrivacy;