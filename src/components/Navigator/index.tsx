import { useRouter } from 'next/router';

import styles from './navigator.module.css'

interface Props {
    onClick?: () => void | undefined;
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
                <span className={`material-icons-rounded click`} onClick={() => router.back()}>subdirectory_arrow_left</span>
            }
            {
                props.parentDirectory ?
                    <h3 className={styles.parentDirectory}>
                        <span onClick={props.onClick}>{props.parentDirectory}</span>
                        <span>/</span>
                        {props.directory}
                    </h3>
                    :
                    <h3 className='click' onClick={() => router.back()}>{props.directory}</h3>
            }
        </div>
    )
}