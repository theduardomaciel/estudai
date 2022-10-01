import { GoogleAuth, OAuth2Client } from "google-auth-library";
import { Auth, drive_v3, google } from "googleapis";

import fs from "fs";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

interface Props {
    accessToken: string;
    refreshToken: string;
}

export default async function uploadFile({ accessToken, refreshToken }: Props) {
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
    const auth: Auth.GoogleAuth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
    });

    /* const tokens = {
        "access_token": accessToken,
        "refresh_token": refreshToken
    }

    const oAuth2Client: OAuth2Client = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        "http://localhost:3000/auth/login"
    );

    oAuth2Client.setCredentials(tokens); */


    const service: drive_v3.Drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: 'photo.jpg',
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('files/photo.jpg'),
    };
    try {
        const fileInfo = {
            resource: fileMetadata,
            media: media,
            fields: 'id',
        } as drive_v3.Params$Resource$Drives$Create;

        const file = await service.files.create(fileInfo);

        console.log('File Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}