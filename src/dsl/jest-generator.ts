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
  public generateAssertEqualCode = (target: string, tobe: string): string => {
    return `expect(${target}).tobe(${tobe})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `${name}\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + ";\n").join("")}`;
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

export {};
