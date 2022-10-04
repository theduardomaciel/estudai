import { User } from "./User";

export type Attachment = {
    id?: string;
    name: string;
    type: string;
    link?: string;
    tags?: JSON;
    createdAt?: Date | string;
    user?: User;
}