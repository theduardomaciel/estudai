import React from "react";
import UsersPortraits from "../UsersPortraits";

import styles from "./task.module.css"

// Contexto
import { useAppContext } from "../../contexts/AppContext";
import Link from "next/link";

interface TaskProps {

}

export default function TaskView(props: TaskProps) {
    const { viewMode } = useAppContext();

    return <Link href={`/task`}>
        <a href="">
            <div className={`${styles.container} ${viewMode === "card" ? styles.card : ""}`}>
                <div className={styles.column}>
                    <div className={styles.icon}>
                        <span className={`material-symbols-rounded`}>grass</span>
                    </div>
                    <div className={styles.description}>
                        <h4>Biologia</h4>
                        <div className={styles.info}>
                            AV3
                            <div className={styles.circle} />
                            Manuscrito
                            <div className={styles.circle} />
                            6,0 pontos
                        </div>
                        <p>A Biologia é uma área complexa que se destina ao estudo dos seres vivos. A Biologia é uma ciência que estuda a vida em seus mais variados aspectos, importando-se em compreender, por exemplo, o funcionamento dos organismos vivos, a relação desses seres com o meio e seu processo de evolução.</p>
                    </div>
                </div>
                <div className={`${styles.column} ${styles.two}`}>
                    <div className={styles.usersHolder}>
                        <UsersPortraits imagesUrls={["https://picsum.photos/id/25/24/24", "https://picsum.photos/id/21/24/24", "https://picsum.photos/id/421/24/24", "https://picsum.photos/id/123/24/24"]} />
                        <p className={styles.usersAmount}>+ de 10 membros já concluíram a atividade</p>
                    </div>
                    <div className={styles.deadline}>
                        <span className={`material-symbols-rounded`}>schedule</span>
                        entrega até 29/02
                    </div>
                </div>
            </div>
        </a>
    </Link>
}