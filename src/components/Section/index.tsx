import styles from './section.module.css'


interface Props {
    title: string;
    classes?: string;
}

export default function Section(props: Props) {
    return (
        <div className={`${styles.container} ${props.classes ? props.classes : ""}`}>
            {props.title}
        </div>
    )
}