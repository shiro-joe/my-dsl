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
    return `@Test public void ${name}() {\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}}`;
  };
  public generateAssertEqualCode = (target: string, tobe: string): string => {
    return `assertEquals(${tobe}, ${target})`;
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
}
