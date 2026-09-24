import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const sampleUser: AuthenticatedUser = {
  id: 7,
  openId: "files-test-user",
  email: "files@example.com",
  name: "Files Test User",
  loginMethod: "test",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("files router", () => {
  it("requires authentication to list files", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.files.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects unsupported file types before touching storage", async () => {
    const caller = appRouter.createCaller(createContext(sampleUser));

    await expect(
      caller.files.upload({
        originalName: "script.bin",
        mimeType: "application/octet-stream",
        sizeBytes: 1,
        base64: "AA==",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
