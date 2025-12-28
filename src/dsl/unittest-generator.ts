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
  public generateFileCode = (name: string, statements: string[]) => {
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
    beforeAll: [name: string, statements: string[]],
    beforeEach: [name: string, statements: string[]],
    afterAll: [name: string, statements: string[]],
    afterEach: [name: string, statements: string[]],
  ) => {
    let res = "";
    res += beforeAll[1].length
      ? `@classmethod\ndef setUpClass(cls):\n${beforeAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`
      : "";
    res += beforeEach[1].length
      ? `def setUp(self):\n${beforeEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}`
      : "";
    res += afterAll[1].length
      ? `@classmethod\n def tearDownClass(cls):\n${afterAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}`
      : "";
    res += afterEach[1].length
      ? `@def tearDown(self):\n${afterEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}`
      : "";
    return res;
  };
  // private readonly keyMap = {
  //   beforeAll: ["@classmethod\n", "setUpClass(cls)"],
  //   beforeEach: ["", "setUp(self)"],
  //   afterAll: ["@classmethod\n", "tearDownClass(cls)"],
  //   afterEach: ["", "tearDown(self)"],
  // };
  // private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
  //   Object.hasOwn(this.keyMap, key);
}
