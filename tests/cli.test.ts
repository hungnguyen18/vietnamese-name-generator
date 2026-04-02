import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import { resolve } from "path";

const CLI_PATH = resolve(__dirname, "../dist/cli.cjs");

function run(...args: string[]): string {
  return execFileSync("node", [CLI_PATH, ...args], { encoding: "utf-8" }).trim();
}

describe("CLI", () => {
  it("--help shows usage", () => {
    const output = run("--help");
    expect(output).toContain("Usage:");
    expect(output).toContain("--count");
    expect(output).toContain("--gender");
  });

  it("--version shows version", () => {
    const output = run("--version");
    expect(output).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("generates one name by default", () => {
    const output = run("--seed", "42");
    expect(output.split("\n")).toHaveLength(1);
  });

  it("--count generates multiple names", () => {
    const output = run("--count", "5", "--seed", "42");
    expect(output.split("\n")).toHaveLength(5);
  });

  it("-n shorthand works", () => {
    const output = run("-n", "3", "--seed", "42");
    expect(output.split("\n")).toHaveLength(3);
  });

  it("--seed produces deterministic output", () => {
    const output1 = run("--seed", "42");
    const output2 = run("--seed", "42");
    expect(output1).toBe(output2);
  });

  it("--gender filters gender", () => {
    const output = run("--gender", "female", "--seed", "42", "--json");
    const parsed = JSON.parse(output);
    expect(parsed[0].gender).toBe("female");
  });

  it("--json outputs valid JSON", () => {
    const output = run("--count", "3", "--seed", "42", "--json");
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(3);
    expect(parsed[0]).toHaveProperty("surname");
    expect(parsed[0]).toHaveProperty("romanized");
  });

  it("--format slug outputs slug format", () => {
    const output = run("--seed", "42", "--format", "slug", "--json");
    const parsed = JSON.parse(output);
    expect(parsed[0].formatted.slug).toMatch(/^[a-z-]+$/);
  });

  it("--format accepts comma-separated values", () => {
    const output = run("--seed", "42", "--format", "full,slug", "--json");
    const parsed = JSON.parse(output);
    expect(parsed[0].formatted.full).toBeDefined();
    expect(parsed[0].formatted.slug).toBeDefined();
  });

  it("--no-middle omits middle name", () => {
    const output = run("--seed", "42", "--no-middle", "--json");
    const parsed = JSON.parse(output);
    expect(parsed[0].middleName).toBe("");
  });
});
