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
                    title={props.footerButtonText ? props.footerButtonText : "SALVAR"}
                    icon={props.buttonIcon ? props.buttonIcon : 'save'}
                    style={{ height: "3.25rem" }}
                    accentColor={`var(--primary-02)`}
                    iconProps={{ size: "1.8rem", color: `var(--light)`, filled: true }}
                    /* classes={`${styles.defaultButton} ${styles.top}`} */
                    /* isSelected={hasInteracted === true}
                    isLoading={isLoading || hasInteracted === null}
                    onClick={toggleInteraction} */
                    preset={"fillHover"}
                />
            </div>
        </div>
    )
}