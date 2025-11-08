import type { Generator } from "./generator.ts";

// Unittest用
export class UnittestCodeGenerator implements Generator {
  public constructor() {}
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
    return `test(${name}, () => { ${statements.join("; ")} })`;
  };
  public generateAssertEqualCode = (target: string, tobe: string): string => {
    return `expect(${target}).tobe(${tobe})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `${name}\n${statements.join("; ")}`;
  };
}
