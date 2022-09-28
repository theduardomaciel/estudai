import Link from 'next/link'
import Note from '../Note'
import styles from './header.module.css'

// Logo
import Logo from "/public/logo.svg"

interface Props {

}

export default function LandingHeader(props: Props) {
    return (
        <div className={`${styles.container}`}>
            <Logo />
            <Note showOnlyInDesktop tag='ALPHA' description='Este projeto ainda está em andamento.' />
            <Link href={"/login"}>
                <p className={styles.link}>Entrar</p>
            </Link>
        </div>
    )
}