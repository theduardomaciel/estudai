import { useRef, useState } from "react"

// Stylesheets
import createTaskStyles from "../../styles/CreateTask.module.css"
import styles from "./styles.module.css";

// Components
import Button from "../Button"
import Section from "../Section"

export default function AttachmentsLoader() {
    const dragFrame = useRef<HTMLDivElement | null>(null);

    const removeDragStyle = () => {
        if (dragFrame.current) {
            dragFrame.current.classList.remove(styles.dragEnter)
        }
    }

    return <div className={createTaskStyles.column}>
        <div className='header'>
            <Section title='Anexos' />
            <Button
                style={{ backgroundColor: "var(--primary-02)", padding: "0.5rem 1rem", border: "1px solid var(--primary-04)" }}
                icon={"link"}
                title='Adicionar link'
            />
        </div>
        <div
            ref={dragFrame}
            className={styles.attachmentHolder}
            onDragEnter={(event) => {
                if (dragFrame.current) {
                    dragFrame.current.classList.add(styles.dragEnter)
                }
            }}
            onDragLeave={() => removeDragStyle()}
            onDragOver={(event) => {
                //console.log('File(s) in drop zone');
                // Prevent default behavior (Prevent file from being opened)
                event.preventDefault();
            }}
            onDrop={(event) => {
                console.log('File dropped');
                // Prevent default behavior (Prevent file from being opened)
                event.preventDefault();
                removeDragStyle()
            }}
        >
            <div className={styles.guide}>
                <div className={styles.beforeHover}>
                    <h6>Arraste arquivos para cá</h6>
                    <p>ou</p>
                    <Button
                        title='Procurar'
                        style={{ backgroundColor: "var(--light)", padding: "0.3rem 1.2rem 0.3rem 1.2rem", color: "var(--primary-03)" }}
                    />
                </div>
                <div className={styles.afterHover}>
                    <span className={`material-symbols-rounded filled`}>
                        upload_file
                    </span>
                    <h6>Carregar</h6>
                </div>
            </div>
        </div>
    </div>
}