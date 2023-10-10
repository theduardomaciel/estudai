import { Metadata, ResolvingMetadata } from "next";

import SettingsAside from "./components/Aside";

import { useTranslations as translation } from "@/i18n/hooks";

type Props = {
    params: { lang: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const lang = params.lang;
    const t = translation();

    return {
        title: t.settings.title,
        description: `${t.settings.title}`,
    };
}

export default async function HomeLayout({
    params,
    children,
}: {
    params: { lang: string };
    children: React.ReactNode;
}) {
    const t = translation();

    return (
        <>
            <div className="flex flex-col w-full h-full items-start overflow-y-auto px-9 pt-9 pb-[calc(3.5rem+var(--sidebar-height))] lg:px-12 lg:py-9 overflow-x-hidden gap-12 lg:gap-24 z-50">
                <h1 className="text-primary-02 font-raleway font-bold text-3xl lg:text-4xl">
                    {t.settings.title}
                </h1>
                <div className="flex flex-col w-full gap-14 lg:flex-row">
                    <SettingsAside
                        dict={t.settings.sections}
                        modalDict={t.modal}
                    />
                    {children}
                </div>
            </div>
        </>
    );
}
