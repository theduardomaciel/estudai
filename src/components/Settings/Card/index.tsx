import { CSSProperties } from 'react';
import Button from '../../Button';
import Input from '../../Input';
import styles from './card.module.css'

interface Props {
    title: string;
    description: string;
    inputPlaceholder?: string;
    footerOutro?: string;
    footerButtonText?: string;
    buttonIcon?: string;
    footerStyle?: string;
}

export default function SettingCard(props: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h3>{props.title}</h3>
                <p>{props.description}</p>
                <Input placeholder={props.inputPlaceholder} />
            </div>
            <div className={`${styles.footer} ${props.footerStyle}`}>
                <p>{props.footerOutro}</p>
                <Button
                    title={props.footerButtonText ? props.footerButtonText : "Salvar"}
                    icon={props.buttonIcon ? props.buttonIcon : 'save'}
                    buttontype={"fillHover"}
                    iconFill={1}
                /* style={{
                    textTransform: "uppercase",
                    background: "transparent",
                    padding: "0.5rem 1rem",
                    gap: "1.5rem",
                    borderRadius: "0.5rem",
                    border: "0.5px solid var(--light)"
                }} */
                />
            </div>
        </div>
    )
}