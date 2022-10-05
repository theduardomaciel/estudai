import { useRouter } from 'next/router';
import styles from './navigator.module.css'

interface Props {
    onClick?: () => void;
    directory: string;
    parentDirectory?: string;
    suppressBackButton?: boolean;
}

export default function Navigator(props: Props) {
    const router = useRouter()

    return (
        <div className={`${styles.container} ${props.parentDirectory ? "parentDirectory" : ""}`}>
            {
                !props.suppressBackButton &&
                <span className={`material-symbols-rounded click`} onClick={() => router.back()}>subdirectory_arrow_left</span>
            }
            {
                props.parentDirectory ?
                    <h3><span>{props.parentDirectory} /</span>{props.directory}</h3>
                    :
                    <h3 onClick={() => router.back()}>{props.directory}</h3>
            }
        </div>
    )
}