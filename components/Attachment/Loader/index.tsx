"use client";
import { useRef } from "react";

// Components
import Section, { SectionHeader } from "@/components/Section";
import Button from "@/components/ui/Button";

import UploadIcon from "@material-symbols/svg-600/rounded/upload_file-fill.svg";
import LinkIcon from "@material-symbols/svg-600/rounded/link.svg";
import { cn } from "@/lib/ui";

export default function AttachmentLoader() {
    const dragFrame = useRef<HTMLDivElement | null>(null);
    const counter = useRef<number>(0);

    const removeDragStyle = () => {
        if (dragFrame.current) {
            dragFrame.current.setAttribute("data-hover", "false");
        }
    };

    return (
        <Section className="flex flex-1">
            <SectionHeader title="Anexos">
                <Button preset={"secondary"} className="bg-primary-03 px-2.5">
                    <LinkIcon
                        className="icon"
                        fontSize={`2.4rem`}
                        color="white"
                    />
                    <p className="hidden lg:inline-block whitespace-nowrap">
                        Adicionar link
                    </p>
                </Button>
            </SectionHeader>
            <div
                ref={dragFrame}
                className={cn(
                    "flex flex-col justify-center items-center p-6 gap-4 relative w-full h-fit lg:h-full",
                    "bg-neutral rounded-base group transition-[150ms]",
                    "shadow-[0px_2px_15px_rgba(0,0,0,0.05)] data-[hover=true]:shadow-[0px_2px_15px_rgba(0,0,0,0.15)]",
                    "border border-solid border-primary-04 data-[hover=true]:border-light-gray",
                    "before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black/10 before:opacity-0 before:rounded-base before:transition-opacity data-[hover=true]:before:opacity-100",
                    {}
                )}
                onDragEnter={(event) => {
                    event.preventDefault();
                    counter.current++;

                    if (dragFrame.current) {
                        dragFrame.current.setAttribute("data-hover", "true");
                    }
                }}
                onDragLeave={() => {
                    counter.current--;

                    if (counter.current === 0) {
                        removeDragStyle();
                    }
                }}
                onDragOver={(event) => {
                    //console.log('File(s) in drop zone');
                    // Prevent default behavior (Prevent file from being opened)
                    event.preventDefault();
                }}
                onDrop={(event) => {
                    console.log("File dropped");
                    // Prevent default behavior (Prevent file from being opened)
                    event.preventDefault();

                    counter.current = 0;
                    removeDragStyle();
                    //processFile("drag", event);
                }}
            >
                {/* center info */}
                <div className="flex flex-col items-center p-6 bg-background-02 border border-dashed border-primary-04 rounded-lg select-none order-last transition-[225ms] group-data-[hover=true]:outline-dashed group-data-[hover=true]:outline-2 group-data-[hover=true]:outline-primary-03 group-data-[hover=true]:scale-105 group-data-[hover=true]:animate-outline">
                    {/* default */}
                    <div className="flex flex-col items-center justify-center gap-1 group-data-[hover=true]:hidden">
                        <h6 className="font-sans font-bold text-base text-center whitespace-pre-line text-primary-02">
                            Arraste arquivos para cá
                        </h6>
                        <p className="font-sans font-medium text-[1rem] text-center text-primary-03">
                            ou
                        </p>
                        <Button
                            className="p-0 shadow-none w-fit border-primary-04 text-primary-04 text-xs z-20"
                            preset={["secondary", "neutral"]}
                        >
                            <label
                                className="flex py-1 px-4 cursor-pointer"
                                htmlFor="attachmentUpload"
                            >
                                Procure arquivos
                            </label>
                        </Button>
                    </div>
                    {/* hover */}
                    <div className="flex-col items-center justify-center gap-1 hidden group-data-[hover=true]:flex z-20">
                        <UploadIcon className="icon text-3xl text-primary-03" />
                        <h6 className="font-sans font-semibold text-base text-center text-primary-03">
                            Solte para enviar
                        </h6>
                    </div>
                    {/* <div className="w-1/2 h-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-04 opacity-50 animate-outline select-none pointer-events-none hidden group-data-[hover=true]:flex rounded-base -z-10" /> */}
                </div>
                {/* <ul>{}</ul> */}
                <label
                    className={
                        "absolute top-0 left-0 w-full h-full bg-transparent cursor-pointer z-10"
                    }
                    htmlFor="attachmentUpload"
                />
                <input
                    /* onChange={(event) => processFile("input", event)} */
                    type={"file"}
                    name="attachmentUpload"
                    id="attachmentUpload"
                    multiple
                />
            </div>
        </Section>
    );
}
