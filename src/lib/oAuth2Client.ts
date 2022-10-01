import { OAuth2Client } from "google-auth-library";

export const oAuth2Client = new OAuth2Client(
    process.env.NEXT_PUBLIC_GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    'postmessage',
);