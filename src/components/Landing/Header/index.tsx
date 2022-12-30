import Link from 'next/link'
import { LandingNote } from '../../../pages'
import Note from '../Note'
import styles from './header.module.css'

// Logo
import Logo from "/public/logo.svg"

interface Props {

}

export default function LandingHeader(props: Props) {
    return (
        <div className={`${styles.container}`}>
            <Link href={`/`} style={{ cursor: "pointer" }}>
                <Logo width={78.19} height={38} fill={`var(--primary-02)`} />
            </Link>
            <LandingNote showOnlyInDesktop />
            <Link href={"/auth/login"}>
                <p className={styles.link}>Entrar</p>
            </Link>
        </div>
    )
}