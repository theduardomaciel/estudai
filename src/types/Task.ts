import { Attachment } from "./Attachment";
import { Group } from "./Group";
import { User } from "./User";

export type TaskType = 'obligatory' | 'elective' | 'av1' | 'av2' | 'recuperation' | 'event';
export type TaskMode = 'written' | 'typed' | 'both' | 'online' | 'free';

export type Task = {
    id: number;
    type: TaskType;
    date: number;
    description?: string;
    subjects: Array<number>;
    mode?: TaskMode;
    maxScore?: number;

    links: Array<string>,
    attachments: Array<Attachment>;

    questionsAmount?: number;
    contents?: Array<string>;

    group: Group;

    title?: string;
    address?: string;

    interactedBy: Array<User>;
    createdBy: User;
}