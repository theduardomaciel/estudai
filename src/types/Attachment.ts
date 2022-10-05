import { User } from "./User";

export type Attachment = {
    id?: string;
    name: string;
    type: string;
    link?: string;
    tags: Array<number>;
    createdAt?: Date | string;
    createdBy?: User;
}