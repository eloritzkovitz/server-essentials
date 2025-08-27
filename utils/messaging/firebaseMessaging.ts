import { JWT } from "google-auth-library";
import axios from "axios";
import fs from "fs";
import path from "path";
import config from "../../config/config";

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

/**
 * Sends a Firebase Cloud Messaging (FCM) notification using the HTTP v1 API.
 *
 * Requires the GOOGLE_APPLICATION_CREDENTIALS environment variable to be set to the path of a Firebase service account JSON file.
 *
 * @param token - The recipient device's FCM token.
 * @param notification - The notification object containing title and body.
 * @param data - (Optional) Custom data payload as key-value pairs.
 * @param android - (Optional) Android-specific options.
 * @param webpush - (Optional) Webpush-specific options.
 * @throws If GOOGLE_APPLICATION_CREDENTIALS is not set or credentials are invalid.
 *
 * @example
 * await sendFcmHttpV1({
 *   token: "recipient_token",
 *   notification: { title: "Hello", body: "World" },
 *   data: { key: "value" }
 * });
 */
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
  const credentialsPath = config.firebase.credentialsPath;
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