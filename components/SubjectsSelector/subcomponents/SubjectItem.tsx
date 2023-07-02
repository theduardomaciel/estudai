"use client";

import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";

interface SubjectItemProps {
    id: string;
    name: string;
    isSelected?: boolean;
    icon: string;
}

export default function SubjectItem({
    id,
    name,
    isSelected,
    icon,
}: SubjectItemProps) {
    return (
        <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
            <Checkbox
                name="subjectItem"
                className="subjectItem"
                id={id}
                checked={isSelected}
            />
            <div className="justify-start items-center gap-[5px] flex">
                <div
                    className="w-3 h-3 relative bg-font-dark-02"
                    style={{
                        mask: `url(${icon}) no-repeat center / contain`,
                        WebkitMask: `url(${icon}) no-repeat center / contain`,
                    }}
                ></div>
                <label
                    htmlFor={id}
                    className="text-font-dark-02 text-xs font-medium tracking-wide"
                >
                    {name}
                </label>
            </div>
        </div>
    );
}
