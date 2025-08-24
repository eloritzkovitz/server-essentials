import { JWT } from "google-auth-library";
import axios from "axios";
import fs from "fs";
import path from "path";
import 'dotenv/config';

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

// Load service account from GOOGLE_APPLICATION_CREDENTIALS env variable
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
}
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(credentialsPath), "utf8")
);

const PROJECT_ID = serviceAccount.project_id;

const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: SCOPES,
});

export async function sendFcmHttpV1({
  token,
  notification,
  data,
  android,
  webpush,
}: {
  token: string;
  notification: { title: string; body: string };
  data?: Record<string, string>;
  android?: any;
  webpush?: any;
}) {
  await jwtClient.authorize();
  const accessToken = jwtClient.credentials.access_token;

  const message = {
    message: {
      token,
      notification,
      data,
      android,
      webpush,      
    },
  };

  await axios.post(
    `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,
    message,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
}