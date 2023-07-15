import { Metadata } from "next";

// Components
import Navigator from "@/components/Navigator";
import SubjectsSelector from "@/components/SubjectsSelector";
import Menu from "@/components/Menu";
import Editor from "@/components/RichText/Editor";
import Button from "@/components/ui/Button";
import Calendar from "@/components/Calendar";

// Icons
import PlaneIcon from "@material-symbols/svg-600/rounded/send-fill.svg";

// Internationalization
import { useTranslations } from "@/i18n/hooks";

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
                    customTitle={
                        <input
                            placeholder="Nova atividade"
                            defaultValue={"Nova atividade"}
                            className="bg-transparent text-2xl placeholder:text-primary-02 text-primary-02 w-fit"
                        />
                    }
                />
                <div className="w-full justify-between items-start gap-[25px] inline-flex min-h-[50%]">
                    {/* <Editor title="Descrição" maxLength={650} /> */}
                    <Editor title="Descrição" maxLength={650} />
                    <SubjectsSelector />
                </div>
            </div>
            <Menu
                style={{
                    justifyContent: "flex-start",
                    gap: "2.5rem",
                }}
            >
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <h2 className="text-font-dark-02 text-2xl font-bold">
                        Data
                    </h2>
                    <Calendar hasMonthSelector />
                </div>
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <h2 className="text-font-dark-02 text-2xl font-bold">
                        Configurações
                    </h2>
                    <div className="flex flex-1 h-full"></div>
                </div>
                <Button preset={"submit"} className="w-full uppercase">
                    <PlaneIcon
                        className="icon group-hover:translate-x-2 transition-transform"
                        fontSize={"2.4rem"}
                    />
                    Enviar Atividade
                </Button>
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
