import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image'

// Sections
import LandingHeader from '../components/Landing/Header';
import LandingFooter from '../components/Landing/Footer';

// Stylesheets
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

// App Context
import { parseCookies } from 'nookies';
import getUserIdByToken from '../services/getUserIdByToken';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { ['auth.token']: token } = parseCookies(context)

    /* if (token) {
        const userId = await getUserIdByToken(token);
        if (userId) {
            return {
                redirect: {
                    destination: "/home",
                    permanent: false
                }
            }
        }
    } */

    console.log(token)
    if (token) {
        return {
            redirect: {
                destination: "/home",
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

const Landing: NextPage = () => {
    return (
        <main className={styles.holder}>
            <Head>
                <title>estudaí</title>
            </Head>
            <LandingHeader />
            <div className={styles.container}>
                <Note showOnlyInMobile tag='ALPHA' />
                <div className={styles.title}>
                    <h1>Organize seus estudos.</h1>
                    <p>Acabe de uma vez por todas com revisões desesperadas 15 minutos antes da prova.</p>
                    <Link href={"/auth/register"}>
                        <Button
                            icon={'arrow_right_alt'}
                            title={"Criar uma conta"}
                            style={{ padding: "1rem 1.5rem", backgroundColor: "var(--primary-02)", borderRadius: "0.5rem", flexDirection: "row-reverse" }}
                        />
                    </Link>
                </div>
                <Device />
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

export default Landing;