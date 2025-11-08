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
  public generateAssertEqualCode = (target: string, tobe: string): string => {
    return `self.assertEqual(${target}, ${tobe})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `class ${name}(unittest.TestCase):\n${statements.map((x) => this.INDENT + x.replace(/\n/g, `\n${this.INDENT}`) + "\n").join("")}`;
  };
}
