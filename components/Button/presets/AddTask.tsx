import AddIcon from "@material-symbols/svg-600/rounded/add.svg";
import Anchor from "../Anchor";
import { Translations } from "@/i18n/hooks";

interface Props {
	query?: {};
	label: string;
}

export const AddTaskButton = ({ query, label }: Props) => (
	<Anchor
		href={{
			pathname: "/task/new",
			query: query,
		}}
		as={`/new`}
		className={
			"w-full lg:h-full bg-primary-02 px-5 text-[1.6rem] border border-solid border-primary-04"
		}
		preset="primary"
	>
		<AddIcon className="icon" fontSize={"1.8rem"} />
		{label}
	</Anchor>
);
