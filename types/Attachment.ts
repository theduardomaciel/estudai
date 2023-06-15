import { User } from "./User";

export type Attachment = {
    id: string,
    name: string;
    type: string;

    tags: Array<number>;
    fileId?: string | File;
    downloadLink?: string;
    viewLink?: string;

    interactedBy: Array<User>;
    createdAt: Date | string | number;
    uploadedBy: User;
}