import { CSSProperties } from "react";
import Link from "next/link";
import RedirectButton from "../Redirect";

import AddIcon from "@material-symbols/svg-600/rounded/add.svg";

interface Props {
	query?: {};
	style?: CSSProperties;
}

export const AddTaskButton = ({ query, style }: Props) => (
	<Link
		href={{
			pathname: "/task/new",
			query: query,
		}}
		as={`/task/new`}
		style={{ width: "100%" }}
	>
		<RedirectButton
			className={"full"}
			style={{
				backgroundColor: "var(--primary-02)",
				padding: "1rem 2.5rem",
				fontSize: "1.6rem",
				border: "1px solid var(--primary-04)",
				...style,
			}}
		>
			<AddIcon className="icon" />
			Add task
		</RedirectButton>
	</Link>
);
