import { Activity, Test, Event } from "@prisma/client";

type Task = Activity | Test | Event;

declare global {
	interface Array<T> {
		filterNoDateTasks(): Array<T>;
		filterArchivedTasks(): Array<T>;

		filterWeekTasks(): Array<T>;
		filterMonthTasks(month?: number, invert?: boolean): Array<T>;
	}
}

export const arrayPrototype = (array: Array<Activity | Test | Event>) => {
	Array.prototype.filterWeekTasks = filterWeekTasks;
	Array.prototype.filterMonthTasks = filterMonthTasks;
	Array.prototype.filterNoDateTasks = filterNoDateTasks;

	Array.prototype.filterArchivedTasks = filterArchivedTasks;
	return array;
};

const filterWeekTasks = () => {
	const tasks = this! as Task[];
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
			return true;
		} else {
			return false;
		}
	});
};

const filterMonthTasks = (month?: number, invert?: boolean) => {
	const tasks = this! as Task[];
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

const filterArchivedTasks = () => {
	const tasks = this! as Task[];
	return tasks.filter(
		(task, _) => task.date && task.date.getTime() <= new Date().getTime()
	);
};

const filterNoDateTasks = () => {
	const tasks = this! as Task[];
	return tasks.filter((task, _) => !task.date);
};
