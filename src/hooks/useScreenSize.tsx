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
    const [isScreenWide, setIsScreenWide] = useState(window.innerWidth >= WIDE_SIZE ? true : false);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
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

    const debouncedFunction = debounce(handleScreenResize, 100)

    useEffect(() => {
        window.addEventListener('resize', debouncedFunction);
        return () => window.removeEventListener('resize', debouncedFunction);
    })

    return { isScreenWide, width, height };
}