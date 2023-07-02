import { Suspense } from "react";

// Components
import Section, { Header as SectionHeader } from "../Section";
import SubjectsSelectorHeader from "./subcomponents/Header";
import SubjectsList from "./subcomponents/SubjectsList";
import Spinner from "../ui/Spinner";
import SubjectsSelectorPreview from "./subcomponents/Preview";
import CreateSubjectButton from "./subcomponents/CreateSubjectButton";

interface Props {}

export default function SubjectsSelector({}: Props) {
    return (
        <Section className="max-h-full">
            <SectionHeader title="Matérias">
                <CreateSubjectButton />
            </SectionHeader>
            <form
                id="subjectsSelector"
                className="self-stretch grow shrink basis-0  flex-col justify-start items-start gap-[5px] flex h-full"
            >
                <SubjectsSelectorPreview />
                <div className="self-stretch grow shrink basis-0 bg-white rounded-lg border border-primary-03 flex-col justify-start items-center flex">
                    <SubjectsSelectorHeader />
                    <div className="self-stretch grow shrink basis-0 pt-2.5 pb-[15px] justify-center items-start inline-flex overflow-x-hidden overflow-y-auto scrollbar">
                        <div className="grow shrink basis-0 px-5 flex-col justify-start items-start gap-2.5 inline-flex">
                            <div className="text-primary-02 text-xs font-medium tracking-wide">
                                Suas matérias
                            </div>
                            {/* <Suspense fallback={<Loading />}>
                                <SubjectsList userOnly />
                            </Suspense>
                            <div className="text-primary-02 text-xs font-medium tracking-wide">
                                Outras matérias
                            </div>
                            <Suspense fallback={<Loading />}>
                                <SubjectsList />
                            </Suspense> */}
                        </div>
                    </div>
                </div>
            </form>
        </Section>
    );
}

function Loading() {
    return (
        <div className="flex items-center justify-center w-full">
            <Spinner className="h-5 w-5" />
        </div>
    );
}
