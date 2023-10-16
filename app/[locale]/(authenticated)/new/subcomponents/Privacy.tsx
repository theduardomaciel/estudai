"use client";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/ui";

import { Label, Root } from "@/components/ui/Root";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "@/components/ui/Select";

// Icons
import Unlocked from "@/public/icons/privacy/unlocked.svg";
import Locked from "@/public/icons/privacy/locked.svg";
import Visible from "@/public/icons/privacy/visible.svg";

const CIRCLE_SIZE = 20;
const TOLERANCE = 10;

export default function PrivacyPanel() {
    const [isGrabbing, setIsGrabbing] = useState(false);

    const onMouseMove = useCallback(
        (event: MouseEvent) => {
            const dragHolder = document.getElementById("dragHolder");
            const drag = document.getElementById("dragPrivacy");

            if (isGrabbing && drag && dragHolder) {
                const x = event.pageX;

                drag.style.cursor = "grabbing";

                if (event.pageX == null && event.clientX != null) {
                    console.log(`x: ${event.clientX}`);
                }

                const offsets = dragHolder.getBoundingClientRect();
                const left = offsets.left;

                const width = dragHolder.clientWidth;

                if (
                    x > left + CIRCLE_SIZE / 2 &&
                    x < left + width - CIRCLE_SIZE / 2
                ) {
                    const pos = x - left - CIRCLE_SIZE / 2;
                    drag.style.left = `${pos < 1 ? 0 : pos}px`;
                }
            }
        },
        [isGrabbing]
    );

    const onBarClick = useCallback(
        (event: MouseEvent) => {
            const dragHolder = document.getElementById("dragHolder");
            const drag = document.getElementById("dragPrivacy");

            if (dragHolder && drag) {
                const x = event.pageX;

                const offsets = dragHolder.getBoundingClientRect();
                const left = offsets.left;
                const width = dragHolder.clientWidth;

                /* if (x > left && x < left + width - CIRCLE_SIZE) {
                    drag.style.left = `${x - left - CIRCLE_SIZE / 2}px`;
                } else if (x >= left + width - CIRCLE_SIZE) {
                    drag.style.left = `${width - CIRCLE_SIZE}px`;
                } else if (x <= left) {
                    drag.style.left = "0px";
                } */
                drag.style.left = `${x - left - CIRCLE_SIZE / 2}px`;
                onDragEnd();
            }
        },
        [isGrabbing]
    );

    const onDragEnd = useCallback(() => {
        setIsGrabbing(false);
        console.log("drag end");

        const dragHolder = document.getElementById("dragHolder");
        const drag = document.getElementById("dragPrivacy");

        if (dragHolder && drag) {
            const offsets = dragHolder.getBoundingClientRect();
            const left = offsets.left;
            const width = dragHolder.clientWidth;

            const pos = parseInt(drag.style.left);

            drag.style.cursor = "grab";

            if (pos < width / 2 - TOLERANCE) {
                console.log("left");
                drag.style.left = "0px";
            } else if (pos > width / 2 + TOLERANCE) {
                console.log("right");
                drag.style.left = `${width - CIRCLE_SIZE}px`;
            } else {
                console.log("center");
                drag.style.left = `${width / 2}px`;
            }
        }
    }, [isGrabbing, setIsGrabbing]);

    useEffect(() => {
        document.addEventListener("mouseup", onDragEnd);

        return () => {
            document.removeEventListener("mouseup", onDragEnd);
        };
    }, []);

    return (
        <Root className="w-full">
            <Label>Privacidade</Label>
            <div className="flex flex-col px-6 py-6 items-center justify-center gap-0 self-stretch border-2 border-solid border-primary-04 rounded bg-neutral w-full">
                <Unlocked width={`4rem`} height={`4rem`} />
                <h6 className="text-font-dark text-xl font-bold font-raleway text-center">
                    Totalmente público
                </h6>
                <p
                    className="flex flex-wrap w-[25rem] text-font-light text-sm font-bold font-raleway text-center"
                    /* style={{
                        textAlign: "justify",
                    }} */
                >
                    Qualquer pessoa com o link pode acessar e editar a atividade
                </p>
            </div>
            <div
                id="dragHolder"
                className={cn("flex w-full h-5 bg-blue-100 relative py-2 z-10")}
                onMouseMove={
                    onMouseMove as unknown as MouseEventHandler<HTMLDivElement>
                }
            >
                <button
                    className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex w-[95%] h-2 bg-primary-04 rounded- -z-10"
                    onClick={onBarClick}
                />
                <button
                    id="dragPrivacy"
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 left-0 bg-primary-01 w-5 h-5 rounded-full z-20"
                    )}
                    onMouseDown={() => setIsGrabbing(true)}
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                    }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 bg-primary-04 w-5 h-5 rounded-full -z-10 pointer-events-none select-none"
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                    }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 left-1/2 bg-primary-04 w-5 h-5 rounded-full -z-10 pointer-events-none select-none"
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                    }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 right-0 bg-primary-04 w-5 h-5 rounded-full -z-10 pointer-events-none select-none"
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                    }}
                />
            </div>
            <div className="flex flex-row items-center justify-center w-full"></div>
            <Label>Anexos</Label>
            <Select defaultValue="PRIVATE">
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a privacidade" />
                </SelectTrigger>
                <SelectContent className="w-full">
                    <SelectItem value="PRIVATE">
                        Somente você pode acessar
                    </SelectItem>
                    <SelectItem value="PUBLIC">
                        Qualquer um com o link pode acessar
                    </SelectItem>
                    <SelectItem value="PUBLIC_ATTACHMENTS">
                        Qualquer um pode inserir anexos
                    </SelectItem>
                    <SelectItem value="PUBLIC_FULL">
                        Qualquer um pode editar e inserir anexos
                    </SelectItem>
                </SelectContent>
            </Select>
        </Root>
    );
}
