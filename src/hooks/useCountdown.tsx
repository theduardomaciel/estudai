import { useCallback, useEffect, useRef, useState } from "react";

const useCountdown = ({ initialCounter, callback }: { initialCounter: number, callback?: any }) => {
    const _initialCounter = initialCounter,
        [resume, setResume] = useState(0),
        [counter, setCounter] = useState(_initialCounter),
        initial = useRef(_initialCounter),
        intervalRef = useRef<any>(null),
        [isPaused, setIsPaused] = useState(false);

    const stopCounter = useCallback(() => {
        clearInterval(intervalRef.current);
        setCounter(0);
        setIsPaused(false);
    }, []);

    const startCounter = useCallback(
        (seconds = initial.current) => {
            intervalRef.current = setInterval(() => {
                const newCounter = seconds--;
                if (newCounter >= 0) {
                    setCounter(newCounter);
                    callback && callback(newCounter);
                } else {
                    console.log("Intervalo acabou. Interrompendo countdown.")
                    stopCounter();
                }
            }, 1000);
        },
        [stopCounter]
    );

    const pauseCounter = () => {
        setResume(counter);
        setIsPaused(true);
        clearInterval(intervalRef.current);
    };

    const resumeCounter = () => {
        startCounter(resume - 1);
        setResume(0);
        setIsPaused(false);
    };

    const resetCounter = useCallback(() => {
        if (intervalRef.current) {
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

    return [
        counter,
        resetCounter,
        stopCounter,
        pauseCounter,
        resumeCounter,
        isPaused
    ];
};

export default useCountdown;