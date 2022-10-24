import React, { useEffect, useState } from "react";

// Components
import Button from "../Button";
import Input from "../Input";
import { Separator } from "../Separator";
import TopicsGroup from "../Topic/TopicsGroup";

// Stylesheets
import styles from "./focus.module.css"

// Types
interface Props {

}

export default function Focus({ }: Props) {

    function moveScroll(amount: number) {
        const scroll = document.getElementById('topicsScroll') as HTMLDivElement;
        /* scroll.scrollLeft -= 20; */
        scroll.scrollTo({
            top: 0,
            left: scroll.scrollLeft + amount,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        const scroll = document.getElementById('topicsScroll') as HTMLDivElement;
        scroll.addEventListener("wheel", function (event) {
            if (event.deltaY > 0) {
                scroll.scrollTo({
                    top: 0,
                    left: scroll.scrollLeft + 100,
                    behavior: 'smooth'
                });
                event.preventDefault();
                // preventDefault() will help avoid worrisome 
                // inclusion of vertical scroll 
            } else {
                scroll.scrollTo({
                    top: 0,
                    left: scroll.scrollLeft - 100,
                    behavior: "smooth"
                });
                event.preventDefault();
            }
        });
    }, [])

    const [focusMinutes, setFocusMinutes] = useState(60);
    const focusPauses = focusMinutes ? Math.max(1, Math.floor(focusMinutes / 25)) : 0;

    return <div className={styles.focus}>
        <div className={`row`}>
            <h3>Foco</h3>
        </div>
        <Input label='Nome da tarefa' placeholder='Insira o nome da tarefa aqui' height={'3.85rem'} />
        <div className={'row'} style={{ gap: "1.5rem" }}>
            <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(-25)}>chevron_left</span>
            <TopicsGroup topics={[
                {
                    icon: '📒',
                    title: 'Resumo'
                },
                {
                    icon: '📚',
                    title: 'Leitura do Livro'
                },
                {
                    icon: '📖',
                    title: 'Leitura'
                },
                {
                    icon: '📝',
                    title: 'Atividade'
                },
                {
                    icon: '📌',
                    title: 'Revisão'
                }
            ]} />
            <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(25)}>chevron_right</span>
        </div>
        <Input
            onChange={(event) => {
                if (event.currentTarget.value.length < 5) {
                    setFocusMinutes(parseInt(event.target.value))
                }
            }}
            value={focusMinutes}
            label='Tempo de atividade'
            placeholder='60'
            type={'number'}
            height={'3.85rem'}
            fixedUnit='minutos'
        />
        <div /* style={{ gap: "2.5rem" }} */ className="row">
            <Button icon={'av_timer'} title={'Iniciar Foco'} preset="sendForm" />
            <Separator decorative orientation="vertical" />
            <p className={styles.intervalCount}>Você terá <br />
                <span>{focusPauses} intervalo{focusPauses !== 1 && "s"}</span></p>
        </div>
    </div>
}