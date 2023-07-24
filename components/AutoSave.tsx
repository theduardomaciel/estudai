import SaveIcon from "@material-symbols/svg-600/rounded/save.svg";
import Spinner from "./ui/Spinner";

type status = "saved" | "saving" | "error";

const ICONS = {
    saved: <SaveIcon className="icon w-3.5 h-3.5 text-primary-04" />,
    saving: <Spinner className="icon w-3.5 h-3.5 text-primary-04" />,
};

export default function AutoSave() {
    const status = "saved" as keyof typeof ICONS;

    return (
        <div className="flex flex-row items-center justify-start gap-2.5">
            {ICONS[status]}
            <p className="text-primary-04 font-raleway text-xs font-bold">
                Alterações são salvas automaticamente
            </p>
        </div>
    );
}
