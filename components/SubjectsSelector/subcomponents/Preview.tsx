"use client";

import { Subject } from "@prisma/client";

interface Props {
    subjects?: Subject[] | null;
}

export default function SubjectsSelectorPreview({ subjects }: Props) {
    return (
        <div className="self-stretch h-10 px-[15px] py-2.5 bg-white rounded-lg border border-primary-03 justify-start items-center gap-2.5 inline-flex">
            <ul className="grow shrink basis-0 h-[15px] justify-start items-center gap-4 flex overflow-hidden">
                {subjects && subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <>
                            <li
                                key={subject.id}
                                className="flex flex-row items-center justify-start select-none pointer-events-none"
                            >
                                <div
                                    key={subject.id}
                                    className="w-3 h-3 relative bg-primary-03"
                                    style={{
                                        mask: `url(${subject.icon}) no-repeat center / contain`,
                                        WebkitMask: `url(${subject.icon}) no-repeat center / contain`,
                                    }}
                                />
                                <p className="text-primary-03 text-xs font-semibold ml-2.5">
                                    {subject.name}
                                </p>
                            </li>
                            {subjects.indexOf(subject) !==
                                subjects.length - 1 && (
                                <li
                                    key={subject.id + "separator"}
                                    className="flex bg-transparent h-3 border-r-primary-04 border-r border-dashed select-none pointer-events-none"
                                />
                            )}
                        </>
                    ))
                ) : (
                    <p className="text-light-gray text-xs font-semibold tracking-wide cursor-default">
                        Nenhuma matéria selecionada
                    </p>
                )}
            </ul>
        </div>
    );
}
