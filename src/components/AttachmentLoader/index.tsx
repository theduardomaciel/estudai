import { useState } from "react"

// Stylesheets
import createTaskStyles from "../../styles/CreateTask.module.css"
import styles from "./styles.module.css";

// Components
import Button from "../Button"
import Section from "../Section"

export default function AttachmentsLoader() {
    return <div className={createTaskStyles.column}>
        <div className='header'>
            <Section title='Anexos' />
            <Button
                style={{ backgroundColor: "var(--primary-02)", padding: "0.5rem 1rem", border: "1px solid var(--primary-04)" }}
                icon={"link"}
                title='Adicionar link'
            />
        </div>
        <div className={styles.attachment}>
            <div className={styles.guide}>
                <h6>Arraste arquivos para cá</h6>
                <p>ou</p>
                <Button
                    title='Procurar'
                    style={{ backgroundColor: "var(--light)", padding: "0.3rem 1.2rem 0.3rem 1.2rem", color: "var(--primary-03)" }}
                />
            </div>
        </div>
    </div>
}