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

const Page404: NextPage = () => {
    const router = useRouter();

    return (
        <main className={styles.holder}>
            <Head>
                <title>opa... 404</title>
            </Head>
            <div className={styles.container} style={{ justifyContent: "center" }}>
                <div className={styles.title}>
                    <h1>Parece que essa página não existe :(<br /> </h1>
                    <p>Demos de cara com um 404, então caso isso não tenha sido esperado, nos contate. <br /> De qualquer forma, volta pro site e aproveita todas as funcionalidades!</p>
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

export default Page404;