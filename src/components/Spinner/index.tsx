import styles from './spinner.module.css'

interface Props {
    color: string;
}

export default function Spinner({ color }: Props) {

    return <div className={styles.loader}>
        <div style={{ borderColor: `${color ? color : "var(--light)"} transparent transparent transparent` }} />
        <div style={{ borderColor: `${color ? color : "var(--light)"} transparent transparent transparent` }} />
    </div>

}