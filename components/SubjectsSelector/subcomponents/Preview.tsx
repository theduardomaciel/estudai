"use client";

import { useEffect, useState } from "react";

interface Subject {
    id: string;
    name: string;
    icon: string;
}

export default function SubjectsSelectorPreview({}) {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        console.log("SubjectsSelectorPreview");
        const form = document.getElementById(
            "subjectsSelector"
        ) as HTMLFormElement;

        if (form) {
            const checkboxes = form.querySelectorAll(
                "input[type=checkbox][name=subjectItem]"
            ) as NodeListOf<HTMLInputElement>;
            console.log(checkboxes);

            checkboxes.forEach((checkbox) => {
                checkbox.addEventListener("change", () => {
                    console.log("change");
                    /* const checkedCheckboxes = form.querySelectorAll(
                        ".subjectItem:checked"
                    ) as NodeListOf<HTMLInputElement>;

                    const subjects: Subject[] = [];

                    checkedCheckboxes.forEach((checkbox) => {
                        const subject: Subject = {
                            id: checkbox.id,
                            name: checkbox.dataset.name!,
                            icon: checkbox.dataset.icon!,
                        };

                        subjects.push(subject);
                    });

                    setSubjects(subjects); */
                });
            });
        }
    }, []);

    return (
        <div className="self-stretch h-10 px-[15px] py-2.5 bg-white rounded-lg border border-primary-03 justify-start items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0 h-[15px] justify-start items-center gap-2.5 flex">
                {subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="w-3 h-3 relative bg-font-dark-02"
                            style={{
                                mask: `url(${subject.icon}) no-repeat center / contain`,
                                WebkitMask: `url(${subject.icon}) no-repeat center / contain`,
                            }}
                        ></div>
                    ))
                ) : (
                    <p className="text-light-gray text-xs font-semibold tracking-wide cursor-default">
                        Nenhuma matéria selecionada
                    </p>
                )}
            </div>
        </div>
    );
}
