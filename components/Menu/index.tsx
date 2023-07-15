import React, { CSSProperties } from "react";

// Components
import Calendar from "@/components/Calendar";
import Focus from "@/components/Focus";
import ToggleMenuButton from "./ToggleButton";

// Stylesheets
import styles from "./menu.module.css";
import { cn } from "@/lib/ui";

interface Props {
    children?: React.ReactNode;
    flex?: boolean;
    style?: CSSProperties;
}

export default function Menu({ children, flex, style }: Props) {
    return (
        <div
            className={cn(styles.holder, {
                [styles.open]: flex,
                [styles.flex]: flex,
            })}
        >
            <div className={cn(styles.content)} style={style}>
                {children ?? (
                    <>
                        <div className={styles.menuHeader}>
                            <div className="row">
                                <h3>Agenda</h3>
                                <ToggleMenuButton type="close" />
                            </div>
                            <Calendar />

                            {/* <div className={styles.eventHolder} >
                        <h6>Próximo evento importante</h6>
                        <div className={styles.card}>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardColumn}>
                                <p style={{ textTransform: "uppercase" }}>AV1 | 3º BIMESTRE</p>
                                <h5>Matemática e Natureza</h5>
                            </div>
                            <div className={styles.cardColumn} style={{ alignItems: "flex-end" }}>
                                <div className='row' style={{ gap: "0.25rem", width: "fit-content" }}>
                                    <span style={{ fontSize: "1.2rem" }} className={`material-symbols-rounded`}>calendar_today</span>
                                    <p>29/02</p>
                                </div>
                                <p style={{ textAlign: "end" }}>90 questões</p>
                            </div>
                        </div>
                    </div> */}
                        </div>
                        {/* <Focus /> */}
                    </>
                )}
            </div>
        </div>
    );
}
