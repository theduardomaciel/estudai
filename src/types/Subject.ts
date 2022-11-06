import { Task } from "./Task";
import { User } from "./User";

export type Subject = {
    id: string;
    name: string;
    icon: string;

    createdByUser?: User,
    tasks: Task[]
}