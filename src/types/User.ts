export type User = {
    id: number;
    firstName: string;
    lastName: string;
    username?: string;
    role?: "user",
    email: string,
    image_url: string,
    courseType: null | number,
    timeMeasure: null | number,
    defaultColor: null | string;
    language: null
}