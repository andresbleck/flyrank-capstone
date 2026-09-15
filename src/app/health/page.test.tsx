import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Health from "@/app/health/page";

const POSTS_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

function makePosts(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Post ${index + 1}`,
  }));
}

// `Health` is an async server component, so it can't go through `render`
// directly — awaiting it first yields the element tree to render.
async function renderHealth() {
  render(await Health());
}

function stubFetch(implementation: () => Promise<unknown>) {
  const fetchMock = vi.fn(implementation);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function okResponse(json: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(json) });
}

describe("Health", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders at most the first five post titles", async () => {
    stubFetch(() => okResponse(makePosts(7)));

    await renderHealth();

    expect(
      screen.getByRole("heading", { name: "Health Check" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 5")).toBeInTheDocument();
    expect(screen.queryByText("Post 6")).not.toBeInTheDocument();
  });

  it("requests the posts endpoint without caching, so the check is live", async () => {
    const fetchMock = stubFetch(() => okResponse(makePosts(1)));

    await renderHealth();

    expect(fetchMock).toHaveBeenCalledWith(POSTS_ENDPOINT, {
      cache: "no-store",
    });
  });

  it("renders an empty list rather than an error when there are no posts", async () => {
    stubFetch(() => okResponse([]));

    await renderHealth();

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.queryByText("Failed to fetch data")).not.toBeInTheDocument();
  });

  it("reports a failure when the response status is not ok", async () => {
    stubFetch(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve([]) }),
    );

    await renderHealth();

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("reports a failure when the request throws", async () => {
    stubFetch(() => Promise.reject(new Error("network down")));

    await renderHealth();

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });

  it("reports a failure when the response body is not valid JSON", async () => {
    stubFetch(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new SyntaxError("Unexpected token")),
      }),
    );

    await renderHealth();

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });
});
