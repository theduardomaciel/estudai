import { Attachment } from "./Attachment";
import { Task } from "./Task";
import { User } from "./User";

export type Group = {
    name: string,
    id: number,

    subgroups: Array<[]>,
    pinnedMessage?: string,
    shareLink: string,
    private: boolean,
    createdAt: Date | string | number,
    tasks: Task[],
    users: User[],
    admins: number[],

    usersThatInteracted: User[]
}