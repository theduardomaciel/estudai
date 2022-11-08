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
            <Link href={`/`} style={{ cursor: "pointer" }}>
                <Logo width={78.19} height={38} fill={`var(--primary-02)`} />
            </Link>
            <Note
                showOnlyInDesktop
                tag='ALPHA'
                description={{
                    landscape: "Este projeto ainda está em andamento, portanto, espere bugs e outros problemas.",
                    portrait: "Este projeto ainda está em andamento."
                }}
            />
            <Link href={"/auth/login"}>
                <p className={styles.link}>Entrar</p>
            </Link>
        </div>
    )
}