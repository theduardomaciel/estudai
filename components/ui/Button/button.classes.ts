export const DEFAULT = [
    "flex flex-row items-center justify-center relative gap-4 px-4 py-2 bg-primary-02 text-neutral visited:text-neutral border border-solid border-primary-04 rounded-base font-karla font-bold text-sm cursor-pointer duration-[450ms] z-10 select-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-[all_265ms] ease-in-out",
];

export const primary = [
    "enabled:hover:bg-primary-02",
    "enabled:hover:outline-[1.5px] enabled:hover:outline enabled:hover:outline-primary-04",
    "enabled:hover:border enabled:hover:border-primary-04",
];

export const secondary = [
    "bg-primary-04",
    "enabled:hover:outline-[2px] enabled:hover:outline enabled:hover:outline-background-02",
    "enabled:hover:border enabled:hover:border-background-02",
];

export const neutral = [
    "p-[1.2rem] gap-8 bg-neutral border border-solid border-light-gray text-font-light font-sans w-full font-medium text-sm shadow-[0px_4px_15px_2px_rgba(0,0,0,0.1)]",
    "enabled:hover:outline-[2px] enabled:hover:outline enabled:hover:outline-primary-04",
    /* "enabled:hover:border-[0.5px] enabled:hover:border-primary-04", */
];

export const scale = ["enabled:hover:scale-105"];

export const submit = [
    "py-3 px-8 gap-6 bg-gradient-to-r from-primary-01 to-primary-02 shadow-sm rounded-lg font-sans font-bold text-xs translate-y-0 uppercase shadow group",
    "enabled:hover:shadow-lg",
];

// enabled:hover:translate-y-[-1.5%]

export const presets = {
    primary,
    secondary,
    neutral,
    scale,
    submit,
};
