import { Group } from "./Group";
import { Task } from "./Task";

export type User = {
	id: string;
	createdAt: Date;
	firstName: string;
	lastName: string;
	username?: string;
	avatar: string;
	role?: "user";
	email: string;
	image_url: string;
	course: null | number;
	timeMeasure: null | number;
	defaultColor: null | string;
	language: null;
	tasks: Array<Task>;

	groups: Array<Group>;
};
