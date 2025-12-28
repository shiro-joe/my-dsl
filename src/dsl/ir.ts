"use strict";

// フィクスチャ
export type fileObject = {
  type: string;
  name: string;
  statements: [];
};

// 代入※
export type assignObject = {
  type: string;
  left: string;
  right: string | callObject;
};

// 呼び出し※
export type callObject = {
  type: string;
  target: string;
  args: [];
};

// 宣言※
export type declareObject = {
  type: string;
  data_type: string;
  left: string;
  right: string | callObject;
};

// テストケース
export type testCaseObject = {
  type: string;
  name: string;
  statements: [];
};

// toEqualアサーション
export type assertEqualObject = {
  type: string;
  target: string | callObject;
  toEqual: string | callObject;
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
//   right: string | callObject;
// };

// export type callObject = {
//   type: TYPE.CALL;
//   target: string;
//   args: [];
// };

// export type testCaseObject = {
//   type: TYPE.TEST_CASE;
//   name: string;
//   statements: [];
// };

// export type assertEqualObject = {
//   type: TYPE.ASSERT_EQUAL;
//   target: string | callObject;
//   tobe: string | callObject;
// };
