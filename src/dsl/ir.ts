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
  right: string | CallObject | RawLangObject;
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
  target: string | CallObject | RawLangObject;
  toEqual: string | CallObject | RawLangObject;
  delta: string;
};
// toBeアサーション
export type AssertSameObject = {
  type: string;
  target: string | CallObject | RawLangObject;
  toBe: string | CallObject | RawLangObject;
};
// toBeTruthy
export type AssertTrueObject = {
  type: string;
  target: string | CallObject | RawLangObject;
};
// toBeFalsy
export type AssertFalseObject = {
  type: string;
  target: string | CallObject | RawLangObject;
};

// null
export type AssertNullObject = {
  type: string;
  target: string | CallObject | RawLangObject;
};

// 例外
export type AssertThrowObject = {
  type: string;
  target: string | CallObject | RawLangObject;
  error: string | RawLangObject;
};

// セットアップ・ティアダウン

export type fixtureObject = {
  beforeAll: { name: string; statements: [] };
  beforeEach: { name: string; statements: [] };
  afterAll: { name: string; statements: [] };
  afterEach: { name: string; statements: [] };
};

// 生言語
export type RawLangObject = {
  type: string;
  lang: string;
  content: string;
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
