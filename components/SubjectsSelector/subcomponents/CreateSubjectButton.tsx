"use client";

// Icons
import AddIcon from "@material-symbols/svg-600/rounded/add.svg";

// Components
import Button from "@/components/ui/Button";

export default function CreateSubjectButton() {
    return (
        <Button preset={"secondary"} className="bg-primary-03 px-2.5">
            <AddIcon className="icon" fontSize={`2.4rem`} color="white" />
            <p className="hidden lg:inline-block whitespace-nowrap">
                Nova matéria
            </p>
        </Button>
    );
}
