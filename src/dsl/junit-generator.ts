import type { Generator } from "./generator.ts";

// JUnit用
export class JUnitCodeGenerator implements Generator {
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
    return `@Test public void ${name}() { ${statements.join(";")} }`;
  };
  public generateAssertEqualCode = (target: string, tobe: string): string => {
    return `assertEquals(${tobe}, ${target})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `public class ${name} {\n    ${statements.join("\n   ")}\n}`;
  };
}
