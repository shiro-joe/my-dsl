import type { Generator } from "./generator.ts";

// JUnit用
export class JUnitCodeGenerator implements Generator {
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
    return `@Test\npublic void ${name}() {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`;
  };
  public generateAssertEqualCode = (
    target: string,
    toEqual: string,
  ): string => {
    return `assertEquals(${toEqual}, ${target})`;
  };
  public generateFixtureCode = (name: string, statements: string[]) => {
    return `public class ${name} {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`;
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
    type: string,
    _name: string,
    statements: string[],
  ) => {
    if (this.isKey(type)) {
      return `@${this.keyMap[type][1]}\n${this.keyMap[type][0]}void ${type}() {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`;
    } else {
      return ``;
    }
  };

  private readonly keyMap = {
    beforeAll: ["static ", "BeforeAll"],
    beforeEach: ["", "BeforeEach"],
    afterAll: ["static ", "AfterAll"],
    afterEach: ["", "AfterEach"],
  };
  private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
    Object.hasOwn(this.keyMap, key);
}
