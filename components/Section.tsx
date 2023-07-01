import { cn } from "@/lib/ui";

export default function Section({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "grow shrink basis-0 self-stretch flex-col justify-start items-start gap-[15px] inline-flex",
                className
            )}
        >
            {children}
        </div>
    );
}

export interface SectionHeaderProps {
    title: string;
    children?: React.ReactNode;
}

export function Header({ title, children }: SectionHeaderProps) {
    return (
        <div className="w-full justify-between items-center gap-[25px] inline-flex">
            <div className="px-4 py-2 bg-primary-04 rounded-md justify-start items-start gap-2.5 inline-flex">
                <p className="text-center text-white text-[16px] font-semibold">
                    {title}
                </p>
            </div>
            {children}
        </div>
    );
}
