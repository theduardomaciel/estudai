import { useEffect, useState } from "react";

const WIDE_SIZE = 1024;

const useScreenSize = () => {
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
            setIsScreenWide(true);
        } else if (windowWidth < WIDE_SIZE && isScreenWide) {
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

export default useScreenSize;