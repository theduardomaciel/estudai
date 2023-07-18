// Components
import { SubjectsSelectorPickerUI } from "./Picker";

// Utils
import getSubjects from "@/services/getSubjects";

export default async function SubjectsSelectorPicker() {
    const subjects = await getSubjects();

    return (
        <>
            <SubjectsSelectorPickerUI
                subjects={subjects ?? undefined}
                hasError={subjects == null}
            />
        </>
    );
}
