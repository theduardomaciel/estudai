import { NextPage } from "next";
import Head from "next/head";

import styles from '../styles/Landing.module.css'

// Components
import Note from '../components/Landing/Note';
import Button from '../components/Button';
import Device from '../components/Landing/Device';

// Icons
import StarIcon from "/public/landing/star.svg";
import PiIcon from "/public/landing/pi.svg";
import EnergyIcon from "/public/landing/energy.svg";
import PaperPlaneIcon from "/public/landing/paper_plane.svg";
import BaskharaIcon from "/public/landing/baskhara.svg";
import { useRouter } from "next/router";

function Error({ statusCode }: { statusCode: string }) {
    const router = useRouter();

    return (
        <main className={styles.holder}>
            <Head>
                <title>opa... parece que tivemos um problema...</title>
            </Head>
            <div className={styles.container} style={{ justifyContent: "center" }}>
                <div className={styles.title}>
                    <h1>Opa! Parece que tivemos um problema!<br /> </h1>
                    <p>
                        {statusCode
                            ? `Um erro (código: ${statusCode}) foi encontrado no servidor.`
                            : 'Um erro foi encontrado no cliente.'}
                    </p>
                    <Button
                        icon={'arrow_left'}
                        title={"Voltar para o início"}
                        onClick={() => router.push('/')}
                        style={{ padding: "1rem 1.5rem", backgroundColor: "var(--primary-02)", borderRadius: "0.5rem", flexDirection: "row-reverse" }}
                    />
                </div>
            </div>
            <StarIcon className={styles.star} />
            <PiIcon className={styles.pi} />
            <EnergyIcon className={styles.energy} />
            <PaperPlaneIcon className={styles.paperPlane} />
            <BaskharaIcon className={styles.baskhara} />
            <StarIcon className={styles.star2} />
        </main>
    )
}

Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error