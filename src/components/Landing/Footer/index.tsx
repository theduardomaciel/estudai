import Link from 'next/link'
import styles from './footer.module.css'

interface Props {

}

export default function LandingFooter(props: Props) {
    return (
        <div className={`${styles.container}`}>
            <h6>estudaí</h6>
            <p>feito com ❤️ por <Link style={{ cursor: "pointer" }} target={"_blank"} href={`https://instagram.com/theduardomaciel`}>@theduardomaciel</Link></p>
        </div>
    )
}