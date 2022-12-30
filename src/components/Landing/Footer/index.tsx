import Link from 'next/link'
import styles from './footer.module.css'
import Translate from '../../Translate'

interface Props {

}

export default function LandingFooter(props: Props) {
    return (
        <div className={`${styles.container}`}>
            <h6>estudaí</h6>
            <p><Translate>made with ❤️ by</Translate> <Link style={{ cursor: "pointer" }} target={"_blank"} href={`https://instagram.com/theduardomaciel`}>@theduardomaciel</Link></p>
        </div>
    )
}