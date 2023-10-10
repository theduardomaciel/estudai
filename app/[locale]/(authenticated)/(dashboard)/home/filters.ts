import {
	Activity,
	Test,
	Event,
	InteractedActivity,
	InteractedEvent,
	InteractedTest,
} from "@prisma/client";

type Task =
	| (Activity & { interactions: InteractedActivity[] })
	| (Test & { interactions: InteractedTest[] })
	| (Event & { interactions: InteractedEvent[] });

export const filterWeekTasks = (tasks: Task[], invert?: boolean) => {
	const actualDate = new Date();
	return tasks.filter((task, _) => {
		if (!task.date) return false;
		const taskDate = new Date(task.date);
		if (
			task.date.getTime() > actualDate.getTime() &&
			taskDate.getFullYear() === actualDate.getFullYear() &&
			taskDate.getMonth() === actualDate.getMonth() &&
			taskDate.getDate() >= actualDate.getDate() &&
			taskDate.getDate() <= actualDate.getDate() + 7
		) {
			return invert ? false : true;
		} else {
			return invert ? true : false;
		}
	});
};

export const filterMonthTasks = (
	tasks: Task[],
	month?: number,
	invert?: boolean
) => {
	const actualDate = new Date();
	return invert
		? tasks.filter((task, _) => {
				if (!task.date) return false;
				const taskDate = new Date(task.date);
				if (
					task.date.getTime() > actualDate.getTime() &&
					taskDate.getFullYear() === actualDate.getFullYear() &&
					taskDate.getMonth() !== actualDate.getMonth()
				) {
					return true;
				} else {
					return false;
				}
		  })
		: tasks.filter((task, _) => {
				if (!task.date) return false;
				const taskDate = new Date(task.date);
				if (
					task.date.getTime() > actualDate.getTime() &&
					taskDate.getMonth() ===
						(month ? month : actualDate.getMonth())
				) {
					return true;
				} else {
					return false;
				}
		  });
};

export const filterNoDateTasks = (tasks: Task[]) => {
	return tasks.filter((task, _) => !task.date);
};

export const filterArchivedTasks = (tasks: Task[], invert?: boolean) => {
	return tasks.filter((task, _) =>
		invert
			? task.date && task.date.getTime() > new Date().getTime()
			: task.date && task.date.getTime() <= new Date().getTime()
	);
};

export const filterInteractedTasks = (
	tasks: Task[],
	userId: string,
	invert?: boolean
) => {
	return invert
		? tasks.filter(
				(task, _) =>
					task.interactions.some(
						(interaction, _) => interaction.userId === userId
					) === false
		  )
		: tasks.filter((task, _) =>
				task.interactions.some(
					(interaction, _) => interaction.userId === userId
				)
		  );
};
