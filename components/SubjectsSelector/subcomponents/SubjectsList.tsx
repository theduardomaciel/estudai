// Components
import { useMemo } from "react";
import SubjectItem from "./SubjectItem";

import getSubjects from "@/services/getSubjects";

interface Props {
    userOnly?: boolean;
}

export default async function SubjectsList({ userOnly }: Props) {
    const subjects = await useMemo(
        async () => await getSubjects(userOnly),
        [userOnly]
    );

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
