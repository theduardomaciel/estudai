"use client";
import { Suspense, useDeferredValue, useMemo, useState } from "react";

// Components
import SubjectsList from "./SubjectsList";
import Spinner from "../../ui/Spinner";

// Icons
import SearchIcon from "@material-symbols/svg-600/rounded/search.svg";

// Utils
import { cn } from "@/lib/ui";
import { Subject } from "@prisma/client";
import SubjectsSelectorPreview from "./Preview";

interface Props {
    subjects?: Subject[] | null;
    hasError?: boolean;
}

export function SubjectsSelectorPickerUI({ subjects, hasError }: Props) {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    // const isStale = query !== deferredQuery;

    const [marked, setMarked] = useState<string[]>([]);

    return (
        <form
            id="subjectsSelectorPicker"
            className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-[5px] flex h-full min-h-[17.5rem]"
            onChange={(event) => {
                //console.log(event.target);
                if (event.target instanceof HTMLInputElement) {
                    const { name } = event.target;
                    if (event.target.checked) {
                        setMarked((prev) => [...prev, name]);
                    } else {
                        setMarked((prev) => prev.filter((id) => id !== name));
                    }
                }
            }}
        >
            {/* Preview */}
            <SubjectsSelectorPreview
                subjects={subjects?.filter((subject) =>
                    marked.includes(subject.id)
                )}
            />

            {/* Search and mark */}
            <div className="self-stretch grow shrink basis-0 bg-white rounded-lg border border-primary-03 flex-col justify-start items-center flex">
                {/* Header */}
                <div className="self-stretch w-full px-[15px] pt-[15px] flex-col justify-start items-start gap-2.5 flex">
                    <div className="self-stretch justify-center items-center gap-[15px] inline-flex">
                        <div className="rounded shadow focus-within:shadow-none border border-light-gray flex-1 justify-start items-center flex relative">
                            <div className="flex items-center justify-center w-4 h-4 left-3 top-1/2 -translate-y-1/2 absolute">
                                <SearchIcon
                                    className="icon"
                                    fontSize={`1.6rem`}
                                    color="var(--font-light)"
                                />
                            </div>
                            <input
                                key={"search"}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Pesquisar matérias"
                                className="flex w-full h-full text-font-light text-xs rounded bg-transparent font-medium tracking-wide gap-2.5 pl-10 py-2.5 pr-2.5 border-transparent focus:border-transparent focus:ring-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-04"
                            />
                            {/* {isPending && (
                            <div className="flex items-center justify-center w-4 h-4 right-3 top-1/2 -translate-y-1/2 absolute">
                                <Spinner className="fill-primary-02 w-4 h-4" />
                            </div>
                        )} */}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setMarked([]);
                                setQuery("");

                                const form = document.getElementById(
                                    "subjectsSelectorPicker"
                                ) as HTMLFormElement;

                                if (form) {
                                    form.reset();
                                }
                            }}
                            className={cn(
                                "flex text-font-light text-xs font-medium tracking-wide cursor-pointer whitespace-nowrap"
                            )}
                        >
                            Limpar tudo
                        </button>
                    </div>
                </div>
                <div className="self-stretch grow shrink basis-0 pt-2.5 pb-[15px] justify-center items-start inline-flex overflow-x-hidden overflow-y-auto scrollbar">
                    <div
                        className="grow shrink basis-0 px-5 flex-col justify-start items-start gap-2.5 inline-flex"
                        /* style={{
                        opacity: isStale ? 0.5 : 1,
                    }} */
                    >
                        <div className="text-primary-02 text-xs font-medium tracking-wide">
                            Suas matérias
                        </div>
                        {subjects ? (
                            <SubjectsList
                                subjects={subjects}
                                query={deferredQuery}
                                marked={marked}
                            />
                        ) : hasError ? (
                            <div className="flex w-full h-full items-center justify-center">
                                <p className="text-primary-02 text-xs font-medium tracking-wide text-center self-center">
                                    Nos deparamos com um erro ao carregar as
                                    suas matérias. <br />
                                    Tente novamente mais tarde.
                                </p>
                            </div>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

function Loading() {
    return (
        <div className="flex flex-1 items-center justify-center h-full w-full">
            <Spinner className="h-5 w-5" />
        </div>
    );
}
