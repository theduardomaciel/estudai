import { useRouter } from "next/router";
import { parseCookies } from "nookies";

import pt_br from "../languages/pt_br.json"

const languages = {
    "pt-BR": pt_br
} as any;


export function TranslateText(text: string, isPlural: boolean = false) {
    const { locale, defaultLocale } = useRouter();
    const language = locale || defaultLocale || 'en';

    // return the translated text or the original text
    if (Object.keys(languages).includes(language)) {
        return isPlural ? languages[language][`${text}_plural`] || text : languages[language][text] || text;
    }

    return text;
};

export default function Translate({ children, plural }: any) {
    return TranslateText(children, plural);
};