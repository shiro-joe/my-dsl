// コードが文字列で返ってくる
export interface Generator {
  generateAssignCode: (left: string, right: string) => string;
  generateCallCode: (target: string, args: string[]) => string;
  generateAssertEqualCode: (target: string, tobe: string) => string;
  generateTestCaseCode: (name: string, statements: string[]) => string;
  generateFileCode: (name: string, statements: string[]) => string;
}
