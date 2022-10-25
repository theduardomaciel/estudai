import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import useCountdown from "../../hooks/useCountdown";

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

export interface Focus {
    name: string;
    topicId: number;
    totalTime: number; // em mili segundos
}

const getCountdownTimes = (countdownSeconds: number) => {
    const hours = Math.floor(countdownSeconds / 3600)
    const minutes = Math.floor(countdownSeconds / 60) % 60
    const seconds = countdownSeconds % 60

    /* return (hours > 0 ? (hours < 10 ?
        `0${hours}` : minutes) + ":" : "") + (seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "")) + seconds; */


    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")

};

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
        if (scroll) {
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
        }
    }, [])

    const topicIdRef = useRef<number>(-1);

    const [focusMinutes, setFocusMinutes] = useState<number | "">("");
    const focusPauses = focusMinutes ? Math.max(1, Math.floor(focusMinutes / 25)) : 0;

    const focusFrameSize = "22.5rem"

    const { currentFocus, startNewFocus, removeFocus } = useAppContext();

    function StartFocus(event: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as unknown as { focusName: string };

        if (data.focusName && focusMinutes) {
            console.warn("Criando novo foco.")
            startNewFocus(data.focusName, topicIdRef.current, focusMinutes * 60)
        }
    }

    const Focus1 = <div className={styles.column} style={{ gap: "1rem", /* justifyContent: "space-between", height: focusFrameSize */ }}>
        <Input label='Nome da tarefa' name="focusName" placeholder='Insira o nome da tarefa aqui' height={'3.85rem'} />
        <div className={'row'} style={{ gap: "1.5rem" }}>
            <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(-25)}>chevron_left</span>
            <TopicsGroup topics={[
                { icon: '📒', title: 'Resumo' },
                { icon: '📚', title: 'Leitura do Livro' },
                { icon: '📖', title: 'Leitura' },
                { icon: '📝', title: 'Atividade' },
                { icon: '📌', title: 'Revisão' }
            ]} topicIdRef={topicIdRef} />
            <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(25)}>chevron_right</span>
        </div>
        <Input
            onChange={(event) => {
                const parsed = parseInt(event.target.value);
                if (parsed) {
                    setFocusMinutes(parsed)
                } else {
                    setFocusMinutes("")
                }
            }}
            value={focusMinutes}
            label='Tempo de atividade'
            placeholder='60'
            maxLength={5}
            type={'text'}
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

    const Focus2 = ({ focus }: { focus: Focus }) => {
        const [counter, resetCounter, stopCounter, pauseCounter, resumeCounter, isPaused] = useCountdown({ initialCounter: focus.totalTime })

        const actualTime = counter as number;
        const timeString = getCountdownTimes(actualTime);
        const timePerSection = Math.floor((focus.totalTime / 60) / (focusPauses === 1 ? focusPauses + 1 : focusPauses));

        if (actualTime === 0) {
            removeFocus();
        }

        return <div className={styles.ongoingFocusContainer} /* style={{ height: focusFrameSize }} */>
            <header>
                <div className={styles.column}>
                    <h5>{focus.name}</h5>
                    <div className={styles.iconHolder}>
                        <span className="material-symbols-rounded static">nest_clock_farsight_analog</span>
                        <p>{`${focus.totalTime / 60} minuto${(focus.totalTime / 60) !== 1 ? 's' : ''}`}</p>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.column} style={{ alignItems: "flex-end" }}>
                        <h6>1/{focusPauses}</h6>
                        {focusPauses > 1 && <p>{timePerSection} minuto{timePerSection !== 1 ? 's' : ""}</p>}
                    </div>
                    <span style={{ fontSize: "2.8rem" }} className="material-symbols-rounded click static">pause_circle</span>
                </div>
            </header>
            <div className={styles.clockHolder}>
                <div className={styles.clock}>
                    <div
                        className={styles.radialProgressIndicator}
                        style={{ color: "red", background: `conic-gradient(var(--primary-01) ${((actualTime * 360) / focus.totalTime)}deg, var(--primary-03) 90deg, var(--primary-02) 180deg, var(--primary-02) 270deg)` }}
                    />
                    <h3 style={{ fontSize: timeString.length > 5 ? "2rem" : "2.4rem" }}>{timeString}</h3>
                </div>
            </div>
        </div>
    }

    return <form className={styles.focus} onSubmit={(event) => {
        event.preventDefault();
        StartFocus(event)
    }}>
        <div className={`row`}>
            <h3>Foco</h3>
        </div>
        {
            currentFocus !== null ?
                <Focus2 focus={currentFocus} />
                : Focus1
        }
    </form>
}