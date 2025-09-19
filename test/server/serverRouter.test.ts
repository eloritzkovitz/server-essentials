import request from "supertest";
import express from "express";
import { createServerRouter } from "../../src/server/serverRouter";
import fs from "fs";

describe("serverRouter", () => {
  let app: express.Express;

  beforeEach(() => {
    const getDbState = () => "up";
    app = express();
    app.use("/", createServerRouter(getDbState));
  });

  it("GET /info returns package info", async () => {
    const res = await request(app).get("/info");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("environment");
  });

  it("GET /health returns health status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: "ok",
      db: "up"
    });
    expect(typeof res.body.uptime).toBe("number");
    expect(typeof res.body.timestamp).toBe("string");
  });

  it("GET /ping returns pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "pong" });
  });
});

describe("serverRouter (package.json fallback)", () => {
  let app: express.Express;
  const originalReadFileSync = fs.readFileSync;

  beforeAll(() => {
    // Mock fs.readFileSync to throw, simulating missing package.json
    (fs.readFileSync as any) = jest.fn(() => { throw new Error("File not found"); });
    app = express();
    app.use("/", createServerRouter(() => "up"));
  });

  afterAll(() => {
    // Restore original fs.readFileSync
    (fs.readFileSync as any) = originalReadFileSync;
  });

  it("GET /info returns fallback package info if package.json is missing", async () => {
    const res = await request(app).get("/info");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: "unknown",
      version: "unknown",
      description: "",
      environment: expect.any(String)
    });
  });
});
