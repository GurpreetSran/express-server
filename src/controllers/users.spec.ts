import { Request, Response } from "express";

import { getAllUsers } from "./users";

describe("users", () => {
  it("should get all users", async () => {
    expect(getAllUsers).toBeDefined();
  });
});
