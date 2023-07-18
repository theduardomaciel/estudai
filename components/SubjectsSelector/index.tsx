import { Suspense } from "react";

// Components
import Section, { Header as SectionHeader } from "../Section";

// Subcomponents
import CreateSubjectButton from "./subcomponents/CreateSubjectButton";
import SubjectsSelectorPicker from "./subcomponents/PickerFetch";
import { SubjectsSelectorPickerUI } from "./subcomponents/Picker";

interface Props {
    searchParams?: { search?: string };
}

export default function SubjectsSelector({ searchParams }: Props) {
    return (
        <Section className="max-h-full">
            <SectionHeader title="Matérias">
                <CreateSubjectButton />
            </SectionHeader>
            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-[5px] flex h-full">
                <Suspense
                    fallback={<SubjectsSelectorPickerUI subjects={null} />}
                >
                    <SubjectsSelectorPicker />
                </Suspense>
            </div>
        </Section>
    );
}
