import { Group } from "@prisma/client";
import { Attachment } from "./Attachment";
import { User } from "./User";

export type Task = {
    id: number;
    type: 'obligatory' | 'elective' | 'av1' | 'av2' | 'recuperation' | 'event';
    date: number;
    description?: string;
    subjects: Array<number>;
    mode?: 'written' | 'typed' | 'both';
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