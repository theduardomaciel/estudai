"use client";

// Components
import SubjectItem from "./SubjectItem";

// Types
import { Subject } from "@prisma/client";

interface Props {
    subjects?: Subject[] | null;
}

export default async function SubjectsList({ subjects }: Props) {
    return (
        <>
            {subjects && subjects.length > 0 ? (
                subjects.map((subject) => (
                    <SubjectItem key={subject.id} {...subject} />
                ))
            ) : (
                <Empty />
            )}
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
