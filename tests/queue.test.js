const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Queue API", () => {
  let token;

  beforeAll(async () => {
    await User.deleteMany({});
    const userResponse = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "password123" })
      .expect(201);
    token = userResponse.body.token;
  });

  it("should enqueue a request", async () => {
    const response = await request(app)
      .post("/api/queue/enqueue")
      .set("Authorization", `Bearer ${token}`)
      .send({ task: "testTask" })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
