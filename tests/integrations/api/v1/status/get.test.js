import orchestrator from "tests/orchestrator.js";

beforeAll(async () => await orchestrator.waitForAllServices());

test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.update_at).toBeDefined();

  const parseUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parseUpdateAt);

  expect(responseBody.database.dependencies.version).toEqual("16.8");

  expect(responseBody.database.dependencies.max_connections).toEqual(100);

  expect(responseBody.database.dependencies.max_opened_connections).toEqual(1);
});
