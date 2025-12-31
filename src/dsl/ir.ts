"use strict";

// フィクスチャ
export type FileObject = {
  type: string;
  name: string;
  statements: [];
};

// 代入※
export type AssignObject = {
  type: string;
  left: string;
  right: string | CallObject;
};

// 呼び出し※
export type CallObject = {
  type: string;
  target: string;
  args: [];
};

// 宣言※
export type DeclareObject = {
  type: string;
  data_type: string;
  left: string;
  right: string | CallObject;
};

// テストケース
export type TestCaseObject = {
  type: string;
  name: string;
  statements: [];
};

// skip
export type SkippedTestCaseObject = {
  type: string;
  name: string;
  statements: [];
};

// toEqualアサーション
export type AssertEqualObject = {
  type: string;
  target: string | CallObject;
  toEqual: string | CallObject;
};
// toBeアサーション
export type AssertSameObject = {
  type: string;
  target: string | CallObject;
  toBe: string | CallObject;
};
// toBeTruthy
export type AssertTrueObject = {
  type: string;
  target: string;
};
// toBeFalsy
export type AssertFalseObject = {
  type: string;
  target: string;
};

// セットアップ・ティアダウン

export type fixtureObject = {
  beforeAll: { name: string; statements: [] };
  beforeEach: { name: string; statements: [] };
  afterAll: { name: string; statements: [] };
  afterEach: { name: string; statements: [] };
};

// export type setupTeardownObject = {
//   beforeAll: { name: string; statements: string[] };
//   beforeEach: { name: string; statements: string[] };
//   afterAll: { name: string; statements: string[] };
//   afterEach: { name: string; statements: string[] };
// };

// enum TYPE {
//   FILE = "fixture",
//   ASSIGN = "assign",
//   CALL = "call",
//   TEST_CASE = "testCase",
//   ASSERT_EQUAL = "assertEqual",
// }

// export type fixtureObject = {
//   type: TYPE.FILE;
//   name: string;
//   statements: [];
// };

// export type assignObject = {
//   type: TYPE.ASSIGN;
//   left: string;
//   right: string | CallObject;
// };

// export type CallObject = {
//   type: TYPE.CALL;
//   target: string;
//   args: [];
// };

// export type TestCaseObject = {
//   type: TYPE.TEST_CASE;
//   name: string;
//   statements: [];
// };

// export type assertEqualObject = {
//   type: TYPE.ASSERT_EQUAL;
//   target: string | CallObject;
//   tobe: string | CallObject;
// };
