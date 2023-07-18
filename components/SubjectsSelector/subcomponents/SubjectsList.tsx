"use client";

// Components
import SubjectItem from "./SubjectItem";

// Types
import { Subject } from "@prisma/client";

interface Props {
    subjects?: Subject[] | null;
    query?: string;
    marked?: string[];
}

export default function SubjectsList({ subjects, query, marked }: Props) {
    const filteredSubjects = subjects?.filter((subject) =>
        subject.name.toLowerCase().includes(query?.toLowerCase() ?? "")
    );
    return (
        <>
            {filteredSubjects && filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                    <SubjectItem
                        key={subject.id}
                        initialMarked={marked?.includes(subject.id)}
                        {...subject}
                    />
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
