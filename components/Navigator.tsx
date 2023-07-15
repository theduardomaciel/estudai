"use client";

import { useRouter } from "next/navigation";

import BackIcon from "@material-symbols/svg-600/rounded/subdirectory_arrow_left.svg";
import Link from "next/link";

interface Props {
    directories: {
        name: string;
        href?: string;
    }[];
    showBackButton?: boolean;
    customTitle?: React.ReactNode;
}

export default function Navigator({
    directories,
    customTitle,
    showBackButton = true,
}: Props) {
    const router = useRouter();

    return (
        <div
            className={
                "flex flex-row items-center justify-start text-primary-02 gap-4"
            }
        >
            {showBackButton && (
                <BackIcon
                    className="icon w-6 h-6 cursor-pointer"
                    fontSize={`2.4rem`}
                    onClick={() => router.back()}
                />
            )}
            <h3 className={"font-raleway font-bold text-2xl"}>
                {directories
                    .slice(0, directories.length - 1)
                    .map((directory, index) => (
                        <span
                            className="text-xl text-primary-03 mr-2.5"
                            key={index}
                        >
                            {directory.href ? (
                                <Link
                                    href={`${directory.href}`}
                                    className="hover:underline"
                                >
                                    <span className="cursor-pointer">
                                        {directory.name}
                                    </span>
                                </Link>
                            ) : (
                                directory.name
                            )}
                            <span className="text-lg text-primary-03"> /</span>
                        </span>
                    ))}
                {customTitle ? (
                    customTitle
                ) : (
                    <span className="text-2xl text-primary-02">
                        {directories[directories.length - 1].name}
                    </span>
                )}
            </h3>
        </div>
    );
}
