import { NextRequest } from "next/server";

export default function isAuthenticated(request: NextRequest) {
    const tokenCookie = request.cookies.get('estudai.token')?.value
    if (tokenCookie) {
        return true;
    } else {
        return false;
    }
}