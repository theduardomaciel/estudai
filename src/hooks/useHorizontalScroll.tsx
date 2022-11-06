import { useEffect } from "react";

function useHorizontalScroll(id?: string, setHorizontalScrollAutomatically?: boolean) {
    function moveScroll(amount: number) {
        if (id) {
            const scroll = document.getElementById(id) as HTMLDivElement;
            /* scroll.scrollLeft -= 20; */
            scroll.scrollTo({
                top: 0,
                left: scroll.scrollLeft + amount,
                behavior: 'smooth'
            });
        } else {
            console.log("Nenhum id foi informado.")
        }
    }

    useEffect(() => {
        if (setHorizontalScrollAutomatically && id) {
            setHorizontalScroll(id)
        }
    }, [])

    function setHorizontalScroll(id: string/* scroll: HTMLDivElement */) {
        const scroll = document.getElementById(id) as HTMLDivElement;
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
    }

    return { moveScroll, setHorizontalScroll }
}

/* 
    REF VERSION

    const tagsContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (tagsContainer.current) {
            tagsContainer.current.addEventListener("wheel", function (event) {
                if (tagsContainer.current) {
                    const container = tagsContainer.current
                    if (event.deltaY > 0) {
                        container.scrollTo({
                            top: 0,
                            left: container.scrollLeft + 100,
                            behavior: 'smooth'
                        });
                        event.preventDefault();
                        // preventDefault() will help avoid worrisome 
                        // inclusion of vertical scroll 
                    } else {
                        container.scrollTo({
                            top: 0,
                            left: container.scrollLeft - 100,
                            behavior: "smooth"
                        });
                        event.preventDefault();
                    }
                }
            });
        }
*/

export default useHorizontalScroll;