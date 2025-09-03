import config from "../../src/config/config";

describe("config", () => {
  afterEach(() => {
    // Reset all env vars to avoid cross-test pollution
    delete process.env.TOKEN_SECRET;
    delete process.env.TOKEN_EXPIRES;
    delete process.env.REFRESH_TOKEN_EXPIRES;
    delete process.env.UPLOAD_DIR;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM;
    delete process.env.RABBITMQ_URL;
    delete process.env.NOTIFICATIONS_QUEUE;
  });

  it("should load jwt config from env", () => {
    process.env.TOKEN_SECRET = "mysecret";
    process.env.TOKEN_EXPIRES = "2h";
    process.env.REFRESH_TOKEN_EXPIRES = "14d";
    expect(config.jwt.secret).toBe("mysecret");
    expect(config.jwt.expires).toBe("2h");
    expect(config.jwt.refreshExpires).toBe("14d");
  });

  it("should load smtp config from env", () => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "2525";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.SMTP_FROM = "from@example.com";
    expect(config.smtp.host).toBe("smtp.example.com");
    expect(config.smtp.port).toBe(2525);
    expect(config.smtp.user).toBe("user");
    expect(config.smtp.pass).toBe("pass");
    expect(config.smtp.from).toBe("from@example.com");
  });

  it("should load firebase config from env", () => {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "/path/to/creds.json";
    expect(config.firebase.credentialsPath).toBe("/path/to/creds.json");
  });

  it("should load messaging config from env", () => {
    process.env.RABBITMQ_URL = "amqp://custom";
    process.env.NOTIFICATIONS_QUEUE = "customQueue";
    expect(config.messaging.rabbitMQURL).toBe("amqp://custom");
    expect(config.messaging.notificationsQueue).toBe("customQueue");
  });

  it("should load uploadDir from env", () => {
    process.env.UPLOAD_DIR = "myuploads";
    expect(config.uploadDir).toBe("myuploads");
  });

  it("should use defaults if env vars are missing", () => {
    expect(config.jwt.secret).toBe("");
    expect(config.jwt.expires).toBe("1h");
    expect(config.jwt.refreshExpires).toBe("7d");
    expect(config.smtp.host).toBe("");
    expect(config.smtp.port).toBe(465);
    expect(config.smtp.user).toBe("");
    expect(config.smtp.pass).toBe("");
    expect(config.smtp.from).toBe("");
    expect(config.firebase.credentialsPath).toBe("");
    expect(config.messaging.rabbitMQURL).toBe("amqp://localhost");
    expect(config.messaging.notificationsQueue).toBe("NOTIFICATIONS_QUEUE");
    expect(config.uploadDir).toBe("uploads");
  });
});
