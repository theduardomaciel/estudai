import { Metadata } from "next";

// Components
import Navigator from "@/components/Navigator";
import SubjectsSelector from "@/components/SubjectsSelector";

// Internationalization
import { useTranslations } from "@/i18n/hooks";
import Menu from "@/components/Menu";
import Editor from "@/components/RichText/Editor";

export const metadata: Metadata = {
    title: "New activity",
    description: "Create a new activity",
};

export const revalidate = 3600; // 24 hours

export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams: { search?: string };
}) {
    const t = useTranslations().tasks.new;

    return (
        <>
            <div className="flex w-full flex-col items-start gap-[3.5rem] px-[5rem] py-[3.5rem]">
                <Navigator
                    directories={[
                        {
                            name: "Minhas tarefas",
                            href: "/",
                        },
                        {
                            name: "Nova atividade",
                        },
                    ]}
                />
                <div className="w-full justify-between items-start gap-[25px] inline-flex min-h-[50%]">
                    <Editor title="Descrição" maxLength={650} />
                    <SubjectsSelector />
                </div>
            </div>
            <Menu>
                <h2>Data</h2>
            </Menu>
        </>
    );
}

function Empty() {
    return (
        <div className="flex items-center justify-center w-full">
            <p className="text-xs text-primary-04 text-center">
                Nenhuma matéria encontrada.
            </p>
        </div>
    );
}
