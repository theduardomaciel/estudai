import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { motion } from "framer-motion"

// Components
import Button from "@/components/Button";
import Input from "@/components/Input";
import Separator from "@/components/Separator";
import TopicsGroup from "@/components/Topic/TopicsGroup";

// Stylesheets
import styles from "./focus.module.css"

// Hooks
import useHorizontalScroll from "@/hooks/useHorizontalScroll";
import useCountdown from "@/hooks/useCountdown";

// Types
interface Props {
    language?: string;
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

const variants = {
    enter: () => {
        return {
            x: 1000,
            opacity: 0
        };
    },
    center: {
        x: 0,
        opacity: 1
    },
    exit: () => {
        return {
            x: -1000,
            opacity: 0,
        };
    }
};

const transition = {
    x: { type: "spring", stiffness: 100, damping: 30, mass: 2, duration: 0.8 },
    opacity: { duration: 0.75 },
}

export default function Focus({ language }: Props) {
    const { moveScroll } = useHorizontalScroll('topicsScroll');

    const topicIdRef = useRef<number>(-1);

    const [focusMinutes, setFocusMinutes] = useState<number | "">("");
    const focusPauses = focusMinutes ? Math.max(1, Math.floor(focusMinutes / 25)) : 1;
    const pauseInterval = (focusMinutes as number * 60) / (focusPauses + 1)

    const { currentFocus, startNewFocus, removeFocus } = useAppContext();
    const [errorMessage, setErrorMessage] = useState("");

    const focusData = [
        { icon: '📒', title: TranslateText("Abstract") },
        { icon: '📚', title: TranslateText("Book reading") },
        { icon: '📖', title: TranslateText("Article reading") },
        { icon: '📝', title: TranslateText("Assignment") },
        { icon: '📌', title: TranslateText("Review") }
    ];

    const TITLE_MISSING = TranslateText("You forgot to give the focus a title!")
    const CATEGORY_MISSING = TranslateText("You forgot to choose a focus category!")

    function StartFocus(event: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()) as unknown as { focusName: string };

        if (!data.focusName) {
            return setErrorMessage(TITLE_MISSING)
        }

        if (topicIdRef.current === -1) {
            return setErrorMessage(CATEGORY_MISSING)
        }

        if (data.focusName && topicIdRef.current !== -1) {
            console.warn("Criando novo foco.")
            startNewFocus(data.focusName, topicIdRef.current, focusMinutes ? focusMinutes * 60 : 60 * 60)
        }
    }

    const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

    async function grantNotificationPermission() {
        if (typeof Notification !== 'undefined') {
            const result = await Notification.requestPermission()
            if (result === "granted") {
                setHasNotificationPermission(true)
            } else {
                setHasNotificationPermission(false)
            }
        }
    }

    let notification: Notification | undefined = undefined;

    function createNotification(title: string, message: string) {
        if (hasNotificationPermission && screen.width > 500) {
            console.log('Tocando áudio de aviso e enviando notificação.')
            const audio = new Audio(`/audio/Focus_Warning.mp3`);
            audio.play();

            notification = new Notification(title, { body: message, icon: '/images/notification_image.png' });
        }
    }

    useEffect(() => {
        const ignoredFocus = parseCookies().ignoredFocus;
        console.log(ignoredFocus, Notification.permission)
        if (ignoredFocus === "true" || Notification.permission === "granted") {
            setHasNotificationPermission(true)
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // The tab has become visible so clear the now-stale Notification.
                if (typeof Notification !== 'undefined') {
                    setTimeout(() => {
                        if (typeof notification !== 'undefined') {
                            notification.close();
                        }
                    }, 500);
                }
            }
        });
    }, [])

    const Focus1 = <div className={styles.column} style={{ gap: "1rem", /* justifyContent: "space-between", height: focusFrameSize */ }}>
        {
            errorMessage !== "" ?
                <motion.div
                    className={styles.ongoingFocusContainer}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transition}
                >
                    <header>
                        <div className={styles.column}>
                            <h5><Translate>Wait a little bit!</Translate></h5>
                            <div className={styles.iconHolder}>
                                <p>{errorMessage}</p>
                            </div>
                        </div>
                    </header>
                    <Button
                        icon={'keyboard_return'}
                        title={TranslateText("Return")}
                        style={{ width: "100%" }}
                        onClick={() => setErrorMessage("")}
                    />
                </motion.div>
                :
                !hasNotificationPermission ?
                    <motion.div
                        className={styles.ongoingFocusContainer}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={transition}
                    >
                        <header>
                            <div className={styles.column}>
                                <h5><Translate>Something's missing...</Translate></h5>
                                <div className={styles.iconHolder}>
                                    <p><Translate>To get the most out of Focus we need you to allow us to send you notifications!</Translate></p>
                                </div>
                            </div>
                        </header>
                        <Button
                            icon={'notifications'}
                            title={TranslateText("Allow")}
                            style={{ width: "100%" }}
                            onClick={grantNotificationPermission}
                        />
                        <Button
                            icon={'notifications_paused'}
                            title={TranslateText("I prefer not to be notified")}
                            style={{ width: "100%" }}
                            onClick={() => {
                                setCookie(null, 'estudai.ignoreFocus', "true", {
                                    path: '/',
                                    maxAge: 15,
                                })
                                setHasNotificationPermission(true)
                            }}
                        />
                    </motion.div>
                    :
                    <>
                        <Input label={TranslateText('Task name')} name="focusName" placeholder={TranslateText("Insert the task name here")} height={'3.85rem'} maxLength={25} />
                        <div className={'row'} style={{ gap: "1.5rem" }}>
                            <span className={`material-symbols-rounded click static`} style={{ color: "var(--primary-02)" }} onClick={() => moveScroll(-25)}>chevron_left</span>
                            <TopicsGroup topics={focusData} topicIdRef={topicIdRef} />
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
                            label={TranslateText("Activity duration")}
                            /* placeholder='escolha um tempo confortável <3' */
                            placeholder="60"
                            maxLength={5}
                            type={'text'}
                            height={'3.85rem'}
                            fixedUnit='minutes'
                        />
                        <div /* style={{ gap: "2.5rem" }} */ className="row">
                            <Button icon={'av_timer'} title={TranslateText("Begin Focus")} preset="sendForm" />
                            <Separator decorative orientation="vertical" />
                            <p className={styles.intervalCount}><Translate>You will have</Translate> <br />
                                <span>{focusPauses} <Translate>break</Translate>{focusPauses !== 1 && "s"}</span></p>
                        </div>
                    </>
        }
    </div>

    const intervalTime = 60 * 5;

    const Focus2 = ({ focus }: { focus: Focus }) => {
        const { actualCounter, status, isPaused, pauseCounter, resumeCounter, stopCounter } = useCountdown({
            initialCounter: focus.totalTime,
            initialIntervalCounter: intervalTime,
            pauseInterval: pauseInterval,
            notificationFunction: createNotification
        })

        const timeString = getCountdownTimes(actualCounter);
        const timePerSection = (focus.totalTime / 60) / (focusPauses === 1 ? focusPauses + 1 : focusPauses);

        const isVisiblyPaused = isPaused && status !== 'interval';
        const actualSection = Math.floor((timePerSection * 60) / actualCounter) + 1;

        return <motion.div
            className={styles.ongoingFocusContainer}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
        >
            <header>
                {
                    status === "interval" ?
                        <>
                            <div className={styles.column}>
                                <h5><Translate>Break time!</Translate></h5>
                                <div className={styles.iconHolder}>
                                    <p><Translate>You're doing well! But you're still not made of steel, so get off the chair and go drink some water :)</Translate></p>
                                </div>
                            </div>
                        </>
                        : status === 'inactive' ?
                            <>
                                <div className={styles.column}>
                                    <h5><Translate>And it comes to an end!</Translate></h5>
                                    <div className={styles.iconHolder}>
                                        <p><Translate>Congrats on staying focused this far.</Translate></p>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className={styles.column} style={{ width: "100%" }}>
                                    <h5>{focus.name}</h5>
                                    <div className={styles.iconHolder}>
                                        <span className="material-symbols-rounded static">nest_clock_farsight_analog</span>
                                        <p>{`${focus.totalTime / 60} minuto${(focus.totalTime / 60) !== 1 ? 's' : ''}`}</p>
                                    </div>
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.column} style={{ alignItems: "flex-end" }}>
                                        <h6>{actualSection}/{focusPauses + 1}</h6>
                                        {focusPauses + 1 > 1 && <p>{Math.floor(timePerSection)} <Translate>minute</Translate>{Math.floor(timePerSection) !== 1 ? 's' : ""}</p>}
                                    </div>
                                    {
                                        status as 'interval' | 'active' | 'inactive' !== "interval" && <span
                                            style={{ fontSize: "2rem" }}
                                            className="material-symbols-rounded click static"
                                            onClick={() => {
                                                if (isPaused) {
                                                    resumeCounter()
                                                } else {
                                                    pauseCounter()
                                                }
                                            }}
                                        >
                                            {isVisiblyPaused ? 'play_circle' : 'pause_circle'}
                                        </span>
                                    }
                                </div>
                            </>
                }
            </header>
            {
                status !== "inactive" ?
                    <div className={styles.clockHolder}>
                        <div className={styles.clock}>
                            <div
                                className={styles.radialProgressIndicator}
                                style={{ color: "red", background: `conic-gradient(var(--primary-01) ${((actualCounter * 360) / (status === "interval" ? intervalTime : focus.totalTime))}deg, var(--primary-03) 90deg, var(--primary-02) 180deg, var(--primary-02) 270deg)` }}
                            />
                            <h3 style={{ fontSize: timeString.length > 5 ? "2rem" : "2.4rem", opacity: isVisiblyPaused ? 0.25 : 1 }}>{timeString}</h3>
                            {isVisiblyPaused && <span onClick={() => stopCounter()} className={`${styles.pauseIcon} material-symbols-rounded static click instantFilled`}>stop</span>}
                        </div>
                    </div>
                    :
                    <Button
                        icon={'keyboard_return'}
                        title={TranslateText("Return")}
                        style={{ width: "100%" }}
                        onClick={() => removeFocus()}
                    />
            }
        </motion.div>
    }

    return <AnimatePresence mode='sync' initial={false}>
        <form
            className={styles.focus}
            onSubmit={(event) => {
                event.preventDefault();
                StartFocus(event)
            }}>
            <motion.div
                className={`row`}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
            >
                <h3><Translate>Focus</Translate></h3>
                {
                    currentFocus &&
                    <div className={styles.focusInfo} >
                        <p className={styles.emoji}>{focusData[currentFocus.topicId].icon}</p>
                        <p>{focusData[currentFocus.topicId].title}</p>
                    </div>
                }
            </motion.div>
            {
                currentFocus !== null ?
                    <Focus2 focus={currentFocus} />
                    : Focus1 // não pode ser um componente <Focus /> por conta da atualização do state que tira o foco do input
            }
        </form>
    </AnimatePresence>
}