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
    isFlex?: boolean;
}

export default function Menu({ children, isFlex }: Props) {
    return (
        <div
            className={cn(styles.holder, "scrollbar", {
                [styles.flex]: isFlex,
            })}
        >
            <div className={styles.content}>
                {children ?? (
                    <>
                        <header>
                            <div className="row">
                                <h3>Agenda</h3>
                                <ToggleMenuButton type="close" />
                            </div>
                            <Calendar />
                            {/*  */}
                        </header>
                        {/* <Focus /> */}
                    </>
                )}
            </div>
        </div>
    );
}
