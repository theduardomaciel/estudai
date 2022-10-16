import { User } from "./User";

export type Attachment = {
    id: string,
    name: string;
    type: string;

    tags: Array<number>;
    fileId?: string | File;
    downloadLink?: string;
    viewLink?: string;

    markedBy: Array<User>;
    createdAt: Date | string | number;
    createdBy?: User;
}