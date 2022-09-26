import { useRouter } from 'next/router';
import styles from './navigator.module.css'

// Icons
import DirectoryArrow from "/public/icons/directory_arrow.svg"

interface Props {
    onClick?: () => void;
    directory: string;
    parentDirectory?: string;
}

export default function Navigator(props: Props) {
    const router = useRouter()

    return (
        <div className={`${styles.container} ${props.parentDirectory ? "parentDirectory" : ""}`}>
            <DirectoryArrow onClick={() => router.back()} style={{ cursor: "pointer" }} />
            {
                props.parentDirectory ?
                    <h3><span>{props.parentDirectory} /</span>{props.directory}</h3>
                    :
                    <h3>{props.directory}</h3>
            }
        </div>
    )
}