import styles from './section.module.css'


interface Props {
    title: string;
}

export default function Section(props: Props) {
    return (
        <div className={styles.container}>
            {props.title}
        </div>
    )
}