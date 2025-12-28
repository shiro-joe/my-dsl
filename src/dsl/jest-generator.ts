import type { Generator } from "./generator.ts";

// Jest用
export class JestCodeGenerator implements Generator {
  public constructor() {}

  private readonly INDENT = "    ";
  public generateAssignCode = (left: string, right: string) => {
    return `${left} = ${right}`;
  };
  public generateCallCode = (target: string, args: string[]) => {
    return `${target}(${args.join(", ")})`;
  };
  public generateTestCaseCode = (
    name: string,
    statements: string[],
  ): string => {
    return `test(${name}, () => {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}})`;
  };
  public generateAssertEqualCode = (
    target: string,
    toEqual: string,
  ): string => {
    return `expect(${target}).toEqual(${toEqual})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `describe(${name}, () => {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}});`;
  };
  public generateDeclareCode = (type: string, left: string) => {
    return `let ${left}`;
  };
  public generateDeclareAndInitializeCode = (
    type: string,
    left: string,
    right: string,
  ) => {
    return `const ${left} = ${right}`;
  };
  public generateSetupTeardownCode = (
    beforeAll: [name: string, statements: string[]],
    beforeEach: [name: string, statements: string[]],
    afterAll: [name: string, statements: string[]],
    afterEach: [name: string, statements: string[]],
  ) => {
    let res = "";
    res += beforeAll[1].length
      ? `beforeAll(() = > {\n${beforeAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}})`
      : "";
    res += beforeEach[1].length
      ? `beforeEach(() = > {\n${beforeEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}})`
      : "";
    res += afterAll[1].length
      ? `afterAll(() = > {\n${afterAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}})`
      : "";
    res += afterEach[1].length
      ? `afterEach(() = > {\n${afterEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}})`
      : "";
    return res;
  };
}
export {};
