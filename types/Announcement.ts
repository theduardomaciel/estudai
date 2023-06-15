import { User } from "./User";

export default interface Announcement {
    id: number;
    user: User;
    description: string;
    materialCondition: string;
    materialPrice: number;
    whatsAppNumber: string | null;
    phoneNumber: string | null;
    email: string | null;
    visualizationsCount: string[];
    isLocked: boolean;
}