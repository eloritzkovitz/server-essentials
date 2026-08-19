import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendFcmHttpV1 } from "../../src/messaging/firebaseMessaging.js";
import fs from "fs";
import axios from "axios";

vi.mock("fs");
vi.mock("axios");
vi.mock("google-auth-library", () => ({
  JWT: vi.fn().mockImplementation(function () {
    return {
      authorize: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
      credentials: { access_token: "fake-access-token" },
    };
  }),
}));

const mockServiceAccount = {
  project_id: "test-project",
  client_email: "test@test.com",
  private_key: "fake-key",
};

describe("sendFcmHttpV1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_APPLICATION_CREDENTIALS =
      "/fake/path/serviceAccount.json";
  });

  it("throws if credentialsPath is not set", async () => {
    const originalEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "";
    await expect(
      sendFcmHttpV1({
        token: "token",
        notification: { title: "t", body: "b" },
      }),
    ).rejects.toThrow(
      "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.",
    );
    process.env.GOOGLE_APPLICATION_CREDENTIALS = originalEnv;
  });

  it("reads service account and sends FCM message", async () => {
    (fs.readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.stringify(mockServiceAccount),
    );
    (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
    });

    await expect(
      sendFcmHttpV1({
        token: "token",
        notification: { title: "t", body: "b" },
        data: { foo: "bar" },
      }),
    ).resolves.toBeUndefined();

    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining("serviceAccount.json"),
      "utf8",
    );
    expect(axios.post).toHaveBeenCalledWith(
      "https://fcm.googleapis.com/v1/projects/test-project/messages:send",
      {
        message: {
          token: "token",
          notification: { title: "t", body: "b" },
          data: { foo: "bar" },
          android: undefined,
          webpush: undefined,
        },
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-access-token",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("passes android and webpush options", async () => {
    (fs.readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      JSON.stringify(mockServiceAccount),
    );
    (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
    });

    const android = { priority: "high" };
    const webpush = { headers: { Urgency: "high" } };

    await expect(
      sendFcmHttpV1({
        token: "token",
        notification: { title: "t", body: "b" },
        android,
        webpush,
      }),
    ).resolves.toBeUndefined();

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        message: expect.objectContaining({
          android,
          webpush,
        }),
      }),
      expect.any(Object),
    );
  });
});
