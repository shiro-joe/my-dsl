import type { Generator } from "./generator.ts";

// Unittest用
export class UnittestCodeGenerator implements Generator {
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
    return `self.assertEqual(${target}, ${toEqual})`;
  };
  public generateFixtureCode = (name: string, statements: string[]) => {
    return `class ${name}(unittest.TestCase):\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
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
      return `${this.keyMap[type][0]}def ${this.keyMap[type][1]}:\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
    } else {
      return "";
    }
  };
  private readonly keyMap = {
    beforeAll: ["@classmethod\n", "setUpClass(cls)"],
    beforeEach: ["", "setUp(self)"],
    afterAll: ["@classmethod\n", "tearDownClass(cls)"],
    afterEach: ["", "tearDown(self)"],
  };
  private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
    Object.hasOwn(this.keyMap, key);
}
