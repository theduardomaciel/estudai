"use client";
import { Fragment } from "react";

import type { Subject } from "@prisma/client";

interface Props {
    subjects?: Subject[] | null;
}

export default function SubjectsSelectorPreview({ subjects }: Props) {
    return (
        <div className="self-stretch h-10 px-[15px] py-2.5 bg-white rounded-lg border border-primary-03 justify-start items-center gap-2.5 inline-flex">
            <ul className="grow shrink basis-0 h-[15px] justify-start items-center gap-4 flex overflow-hidden">
                {subjects && subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <Fragment key={subject.id}>
                            <li
                                key={`${subject.id}_preview`}
                                className="flex flex-row items-center justify-start select-none pointer-events-none"
                            >
                                <div
                                    key={`${subject.id}_preview_icon`}
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
                                    key={`${subject.id}_preview_divider`}
                                    className="flex bg-transparent h-3 border-r-primary-04 border-r border-dashed select-none pointer-events-none"
                                />
                            )}
                        </Fragment>
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
