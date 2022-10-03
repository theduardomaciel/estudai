export default function debounce(func: Function, time = 100) {
    let timer: any;
    return function (event: any) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, time, event);
    };
}