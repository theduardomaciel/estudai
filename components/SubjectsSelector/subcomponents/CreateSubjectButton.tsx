"use client";

// Icons
import AddIcon from "@material-symbols/svg-600/rounded/add.svg";

// Components
import Button from "@/components/ui/Button";

export default function CreateSubjectButton() {
    return (
        <Button
            preset={"secondary"}
            className="px-2.5 h-full flex flex-row items-center justify-center bg-primary-03 rounded border border-primary-04 gap-2.5 text-white text-sm font-bold"
        >
            <AddIcon className="icon" fontSize={`2.4rem`} color="white" />
            <div className="">Criar matéria</div>
        </Button>
    );
}
