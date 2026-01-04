import type { Generator } from "./generator.ts";

// JUnit用
export class JUnitCodeGenerator implements Generator {
  lang = "Java";
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
  public generateSkippedTestCaseCode = (
    name: string,
    statements: string[],
  ): string => {
    return `@Disabled\n@Test\npublic void ${name}() {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`;
  };
  public generateAssertEqualCode = (
    target: string,
    toEqual: string,
    delta: number,
  ): string => {
    if (delta) {
      return `assertEquals(${toEqual}, ${target}, 1e-${delta})`;
    }
    return `assertEquals(${toEqual}, ${target})`;
  };
  public generateAssertSameCode = (target: string, toEqual: string): string => {
    return `assertSame(${toEqual}, ${target})`;
  };
  public generateAssertTrueCode = (target: string) => {
    return `assertTrue(${target})`;
  };
  public generateAssertFalseCode = (target: string) => {
    return `assertFalse(${target})`;
  };
  public generateAssertNullCode = (target: string) => {
    return `assertNull(${target})`;
  };
  public generateAssertThrowCode = (target: string, error: string) => {
    if (error) {
      return `assertThrows(${error}, ${target})`;
    }
    return `assertThrows(Exception.class, ${target})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
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
    beforeAll: [name: string, statements: string[]],
    beforeEach: [name: string, statements: string[]],
    afterAll: [name: string, statements: string[]],
    afterEach: [name: string, statements: string[]],
  ) => {
    let res = "";
    res += beforeAll[1].length
      ? `@BeforeAll\nstatic void beforeAll() {\n${beforeAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`
      : "";
    res += beforeEach[1].length
      ? `@BeforeEach\nvoid beforeEach() {${beforeEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`
      : "";
    res += afterAll[1].length
      ? `@AfterAll\nstatic void afterAll() {\n${afterAll[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`
      : "";
    res += afterEach[1].length
      ? `@AfterEach\n void afterEach() {\n${afterEach[1].map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`
      : "";
    return res;
  };
  public generateRawLangCode = (lang: string, content: string) => {
    if (lang == this.lang) {
      return content;
    }
    return `// ${content}`;
  };
  // private readonly keyMap = {
  //   beforeAll: ["static ", "BeforeAll"],
  //   beforeEach: ["", "BeforeEach"],
  //   afterAll: ["static ", "AfterAll"],
  //   afterEach: ["", "AfterEach"],
  // };
  // private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
  //   Object.hasOwn(this.keyMap, key);
}
