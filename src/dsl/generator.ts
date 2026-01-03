// コードが文字列で返ってくる
export interface Generator {
  generateAssignCode: (left: string, right: string) => string;
  generateCallCode: (target: string, args: string[]) => string;
  generateAssertEqualCode: (
    target: string,
    tobe: string,
    delta: number,
  ) => string;
  generateAssertSameCode: (target: string, tobe: string) => string;
  generateAssertTrueCode: (target: string) => string;
  generateAssertFalseCode: (target: string) => string;
  generateAssertNullCode: (target: string) => string;
  generateAssertThrowCode: (target: string, error: string) => string;
  generateTestCaseCode: (name: string, statements: string[]) => string;
  generateSkippedTestCaseCode: (name: string, statements: string[]) => string;
  generateFileCode: (name: string, statements: string[]) => string;
  generateDeclareCode: (type: string, left: string) => string;
  generateDeclareAndInitializeCode: (
    type: string,
    left: string,
    right: string,
  ) => string;
  // generateSetupTeardownCode: (
  //   type: string,
  //   name: string,
  //   statements: string[],
  // ) => string;
  generateSetupTeardownCode: (
    beforeAll: [name: string, statements: string[]],
    beforeEach: [name: string, statements: string[]],
    afterAll: [name: string, statements: string[]],
    afterEach: [name: string, statements: string[]],
  ) => string;
}
