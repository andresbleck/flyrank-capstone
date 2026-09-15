import { expect, test } from "@playwright/test";
import { buildAiCoachStreamBody } from "./fixtures/ai-coach-stream";

const USER_MESSAGE = "How much protein should I eat?";
const ASSISTANT_REPLY = "Aim for roughly 1.6g of protein per kg of bodyweight.";

test("primary flow: land on the site, chat with the AI coach, get a reply", async ({
  page,
}) => {
  let aiRequestCount = 0;
  let capturedBody: { messages?: { parts?: { text?: string }[] }[] } = {};

  await page.route("**/api/ai-coach", async (route) => {
    aiRequestCount += 1;
    capturedBody = JSON.parse(route.request().postData() ?? "{}");
    await route.fulfill({
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "x-vercel-ai-ui-message-stream": "v1",
      },
      body: buildAiCoachStreamBody(ASSISTANT_REPLY),
    });
  });

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "FORGE" }),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "AI Coach" })
    .click();
  await expect(page).toHaveURL("/ai-coach");

  await page.getByLabel(/what's your name/i).fill("Andres");
  await page.getByRole("button", { name: "Start chatting" }).click();

  await expect(
    page.getByText("Welcome to your AI Coach!"),
  ).toBeVisible();

  await page.getByRole("textbox").fill(USER_MESSAGE);
  await page.getByRole("button", { name: "Send" }).click();

  const log = page.getByRole("log");
  await expect(log.getByText(USER_MESSAGE)).toBeVisible();
  await expect(log.getByText(ASSISTANT_REPLY)).toBeVisible();

  expect(aiRequestCount).toBe(1);
  expect(capturedBody.messages?.at(-1)?.parts?.[0]?.text).toBe(USER_MESSAGE);
});
