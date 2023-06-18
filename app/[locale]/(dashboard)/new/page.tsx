import { useTranslations } from "@/i18n/hooks";
import Link from "next/link";

// Icons
import ActivityIcon from "@material-symbols/svg-600/rounded/book.svg";
import TestIcon from "@material-symbols/svg-600/rounded/hotel_class.svg";
import EventIcon from "@material-symbols/svg-600/rounded/local_activity.svg";

import GenericIcon from "@material-symbols/svg-600/rounded/square.svg";

const TASK_TYPES = {
	activity: ActivityIcon,
	test: TestIcon,
	event: EventIcon,
};

export default function Page({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const t = useTranslations().tasks.new;

	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-6 lg:max-w-[40vw]">
				<h1 className="font-sans font-semibold text-base text-font-dark">
					{t.title}
				</h1>
				<ul className="flex flex-col items-center justify-center gap-y-2">
					{Object.keys(TASK_TYPES).map((type) => (
						<TaskType
							key={type}
							type={type}
							icon={TASK_TYPES[type as keyof typeof TASK_TYPES]}
							title={t.tasks[type as keyof typeof t.tasks].title}
							description={
								t.tasks[type as keyof typeof t.tasks]
									.description
							}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

interface TaskTypeProps {
	type: string;
	icon: React.FC<React.SVGProps<HTMLOrSVGElement>>;
	title: string;
	description: string;
}

const TaskType = ({ icon: Icon, title, description, type }: TaskTypeProps) => (
	<Link className="flex-1" href={`/new/${type}`}>
		<li
			key={type}
			className="box-border flex flex-row items-start p-4 gap-4 border-2 border-primary-02 rounded-md cursor-pointer hover:outline-none hover:border-primary-04 hover:border-2 hover:shadow-md transition-all"
		>
			<div className="p-5 bg-background-03 rounded-md flex items-center justify-center">
				{Icon ? (
					<Icon
						className="icon min-w-[2.4rem]"
						fontSize={`2.4rem`}
						color="var(--primary-03)"
					/>
				) : (
					<GenericIcon
						className="icon min-w-[2.4rem]"
						fontSize={`2.4rem`}
						color="var(--primary-03)"
					/>
				)}
			</div>
			<div className="flex flex-col items-start p-0 gap-1">
				<h2 className="font-sans font-semibold text-sm text-font-dark-02">
					{title}
				</h2>
				<p className="font-sans font-medium text-xs text-font-light">
					{description}
				</p>
			</div>
		</li>
	</Link>
);
