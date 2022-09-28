import { useEffect, useState } from "react";

const WIDE_SIZE = 1024;

function debounce(func: Function, time = 100) {
    let timer: any;
    return function (event: any) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, time, event);
    };
}

export const useScreenSize = () => {
    const [isScreenWide, setIsScreenWide] = useState(false);
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0
    });

    const width = screenSize.width;
    const height = screenSize.height;

    function handleScreenResize() {
        const windowWidth = window.innerWidth; /* Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) */
        const windowHeight = window.innerHeight;

        if (windowWidth >= WIDE_SIZE && !isScreenWide) {
            console.log("Tela agora é larga.");
            setIsScreenWide(true);
        } else if (windowWidth < WIDE_SIZE && isScreenWide) {
            console.log("Tela agora é pequena.");
            setIsScreenWide(false);
        }
        setScreenSize({
            width: windowWidth,
            height: windowHeight
        });
    }

    /* const debouncedFunction = debounce(handleScreenResize, 100)

    useEffect(() => {
        window.addEventListener('resize', debouncedFunction);
        return () => window.removeEventListener('resize', debouncedFunction);
    }) */

    useEffect(() => {
        handleScreenResize()
    }, [])

    useEffect(() => {
        window.addEventListener('resize', handleScreenResize);
        return () => window.removeEventListener('resize', handleScreenResize);
    })

    return { isScreenWide, width, height };
}