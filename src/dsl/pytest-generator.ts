import type { Generator } from "./generator.ts";

// pytest用
export class PytestCodeGenerator implements Generator {
  public constructor() {}

  private readonly INDENT = "    ";

  public generateAssignCode = (left: string, right: string) => {
    return `${left} = ${right}`;
  };
  public generateCallCode = (target: string, args: string[]) => {
    return `${target}(${args.join(", ")})`;
  };
  public generateTestCaseCode = (name: string, statements: string[]) => {
    return `def ${name}(self):\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
  };
  public generateAssertEqualCode = (
    target: string,
    toEqual: string,
  ): string => {
    return `assert ${target} == ${toEqual}`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `class ${name}:\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
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
    const suiteFx = `@pytest.fixture(scope="module", autouse=True)\ndef suite_fixture:\n${beforeAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}${this.INDENT}yield\n${afterAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
    const caseFx = `@pytest.fixture(scope="function", autouse=True)\ndef suite_fixture:\n${beforeEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}${this.INDENT}yield\n${afterEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
    return suiteFx + caseFx;
  };
}
