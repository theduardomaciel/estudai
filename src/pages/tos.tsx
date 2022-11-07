import type { NextPage } from 'next'

import Head from 'next/head';

// Sections
import LandingHeader from '../components/Landing/Header';
import LandingFooter from '../components/Landing/Footer';

// Stylesheets
import styles from '../styles/Landing.module.css'

// Components
import Note from '../components/Landing/Note';

const TermsOfService: NextPage = () => {
    return (
        <main className={styles.holder}>
            <Head>
                <title>estudaí</title>
            </Head>
            <LandingHeader />
            <div className={styles.container} style={{ justifyContent: "center", marginBottom: "6.5rem" }}>
                <Note showOnlyInMobile tag='ALPHA' />
                <div className={styles.title} style={{ maxWidth: "65%" }}>
                    <h2>Relaxa, só queremos paz e tranquilidade.</h2>
                    <p>Em relação a nossos termos, somente <strong>pedimos que você mantenha uma boa conduta durante o uso na plataforma.</strong></p>
                    <p>Ainda estamos em seus estágios iniciais de desenvolvimento, portanto, muitos problemas e falhas estarão presentes na aplicação durante esse período. </p>
                    <p>Nesse cenário, práticas como o abuso de bugs e outros problemas para prejudicar o desempenho da plataforma são totalmente repudiáveis.</p>
                    <p><strong>Contamos com você para fazer do estudaí um ambiente livre e seguro a todos.</strong></p>
                    <p>- equipe estudaí 💜</p>
                </div>
            </div>
            <LandingFooter />
        </main>
    )
}

export default TermsOfService;