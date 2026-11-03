import { describe, expect, it } from "bun:test";
import { NpmPublishLatestTagError } from "./npm-publish-latest-tag-error";
import { PackageJsonError } from "./package-json-error";

describe("PackageJsonError", () => {
  it("should be an NpmPublishLatestTagError", () => {
    const error = new PackageJsonError("message");

    expect(error).toBeInstanceOf(NpmPublishLatestTagError);
  });

  it("should be an Error", () => {
    const error = new PackageJsonError("message");

    expect(error).toBeInstanceOf(Error);
  });

  it("should be named after the class that was thrown", () => {
    const error = new PackageJsonError("message");

    expect(error.name).toBe("PackageJsonError");
  });

  it("should keep the message", () => {
    const error = new PackageJsonError("message");

    expect(error.message).toBe("message");
  });

  it("should keep the cause", () => {
    const cause = new Error("cause");

    const error = new PackageJsonError("message", { cause });

    expect(error.cause).toBe(cause);
  });
});
