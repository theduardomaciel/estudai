import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
    initialCounter: number,
    initialIntervalCounter: number
    pauseInterval: number
}

const useCountdown = ({ initialCounter, initialIntervalCounter, pauseInterval }: Props) => {
    const _initialCounter = initialCounter,
        resume = useRef(0),
        [counter, setCounter] = useState(_initialCounter),
        initial = useRef(_initialCounter),
        loopRef = useRef<any>(null),
        [isPaused, setIsPaused] = useState(false);

    const [status, setStatus] = useState<'active' | 'inactive' | 'interval'>('inactive');
    const [intervalCounter, setIntervalCounter] = useState(initialIntervalCounter)
    const currentIntervalIndexRef = useRef(1);
    const intervalLoopRef = useRef<any>(null);

    const stopCounter = useCallback(() => {
        clearInterval(loopRef.current);
        setCounter(0);
        setIsPaused(false);
        setStatus('inactive')
    }, []);

    function beginInterval() {
        let intervalSeconds = initialIntervalCounter;

        console.log('Início do intervalo...')
        setStatus('interval')

        currentIntervalIndexRef.current = currentIntervalIndexRef.current + 1;
        pauseCounter();

        intervalLoopRef.current = setInterval(() => {
            const newIntervalCounter = intervalSeconds--;
            if (newIntervalCounter >= 0) {
                setIntervalCounter(newIntervalCounter)
            } else {
                clearInterval(intervalLoopRef.current)

                console.log('Fim do intervalo...')
                setStatus('active')
                resumeCounter()
            }
        }, 1000)
    }

    const startCounter = useCallback(
        (seconds = initial.current) => {
            console.log('Iniciando loop decrescente a partir de: ', seconds)
            setStatus('active')
            loopRef.current = setInterval(() => {
                const newCounter = seconds--;
                if (newCounter >= 0) {
                    //console.log(`${newCounter} segundos`);
                    setCounter(newCounter);
                    resume.current = newCounter;

                    if (newCounter !== 0 && newCounter % (pauseInterval * currentIntervalIndexRef.current) === 0) {
                        clearInterval(loopRef.current);
                        beginInterval()
                    }
                } else {
                    stopCounter();
                }
            }, 1000);
        },
        [stopCounter]
    );

    const pauseCounter = () => {
        /* resume.current = counter; */
        console.log('Pausando o countdown com o número ', resume.current)
        setIsPaused(true);
        clearInterval(loopRef.current);
    };

    const resumeCounter = () => {
        console.log("Retornando o countdown com o número ", resume.current)
        startCounter(resume.current - 1);
        resume.current = 0;
        setIsPaused(false);
    };

    const resetCounter = useCallback(() => {
        if (loopRef.current) {
            stopCounter();
        }
        setCounter(initial.current);
        startCounter(initial.current - 1);
    }, [startCounter, stopCounter]);

    useEffect(() => {
        resetCounter();
    }, [resetCounter]);

    useEffect(() => {
        return () => {
            stopCounter();
        };
    }, [stopCounter]);

    const actualCounter = status === "interval" ? intervalCounter : counter;
    return { actualCounter, status, isPaused, pauseCounter, resumeCounter, stopCounter };
};

export default useCountdown;