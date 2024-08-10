const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth API", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  it("should register a user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "password123" })
      .expect(201);

    expect(response.body.user).toHaveProperty("_id");
  });

  it("should login a user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "password123" })
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});
