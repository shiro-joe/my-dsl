// コードが文字列で返ってくる
export interface Generator {
  generateAssignCode: (left: string, right: string) => string;
  generateCallCode: (target: string, args: string[]) => string;
  generateAssertEqualCode: (target: string, tobe: string) => string;
  generateTestCaseCode: (name: string, statements: string[]) => string;
  generateFixtureCode: (name: string, statements: string[]) => string;
  generateDeclareCode: (type: string, left: string) => string;
  generateDeclareAndInitializeCode: (
    type: string,
    left: string,
    right: string,
  ) => string;
  generateSetupTeardownCode: (
    type: string,
    name: string,
    statements: string[],
  ) => string;
}
