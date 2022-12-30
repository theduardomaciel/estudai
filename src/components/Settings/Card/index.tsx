import React from 'react';
import Button, { ButtonProps } from '../../Button';

import styles from './card.module.css'

import { TranslateText } from '../../Translate';

interface Props {
    title: string;
    description: string;
    color?: string;
    accentColor?: string;
    footer?: {
        button?: ButtonProps;
        hint?: string;
    };
    children?: React.ReactNode;
}

const DEFAULT_COLOR = "var(--primary-03)";

export default function SettingCard({ title, description, color, accentColor, footer, children }: Props) {
    const COLOR = color ? color : DEFAULT_COLOR;
    return (
        <div className={`${styles.container} ${footer ? styles.hasFooter : ""}`} style={{ outlineColor: COLOR }}>
            <div className={styles.content}>
                <h3 style={{ color: COLOR }}>{title}</h3>
                <p>{description}</p>
                {children}
            </div>
            {
                footer &&
                <div className={`${styles.footer}`} style={{ backgroundColor: COLOR }}>
                    <p>{footer.hint}</p>
                    {
                        footer.button &&
                        <Button
                            title={footer.button?.title ? footer.button.title : TranslateText("Save")}
                            icon={footer.button?.icon ? footer.button.icon : 'save'}
                            style={{ height: "3.25rem", textTransform: "uppercase", ...footer.button?.style }}
                            accentColor={accentColor ? accentColor : `var(--primary-02)`}
                            iconProps={{ size: "1.8rem", color: `var(--light)`, filled: true, ...footer.button?.iconProps }}
                            preset={"fillHover"}
                            {...footer.button}
                        />
                    }
                </div>
            }
        </div>
    )
}