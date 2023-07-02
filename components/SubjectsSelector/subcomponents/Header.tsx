"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback } from "react";

// Icons
import SearchIcon from "@material-symbols/svg-600/rounded/search.svg";
import { cn } from "@/lib/ui";

export default function SubjectsSelectorHeader({}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(
                searchParams?.toString()
            );

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    return (
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
                        onChange={(e) => {
                            const newQueryString = createQueryString({
                                search: e.target.value,
                            });
                            if (e.target.value === "") {
                                startTransition(() => {
                                    router.push(pathname);
                                });
                            } else {
                                startTransition(() => {
                                    router.push(
                                        pathname + "?" + newQueryString
                                    );
                                });
                            }
                        }}
                        placeholder="Pesquisar matérias"
                        className="flex w-full h-full text-font-light text-xs rounded bg-transparent font-medium tracking-wide gap-2.5 pl-10 py-2.5 pr-2.5 border-transparent focus:border-transparent focus:ring-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-04"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        const form = document.getElementById(
                            "subjectsSelector"
                        ) as HTMLFormElement;
                        if (form) form.reset();
                    }}
                    className={cn(
                        "flex text-font-light text-xs font-medium tracking-wide cursor-pointer whitespace-nowrap"
                    )}
                >
                    Limpar tudo
                </button>
            </div>
        </div>
    );
}
