"use strict";

export type fixtureObject = {
  type: string;
  name: string;
  statements: [];
};

export type assignObject = {
  type: string;
  left: string;
  right: string | callObject;
};

export type callObject = {
  type: string;
  target: string;
  args: [];
};

export type declareObject = {
  type: string;
  data_type: string;
  left: string;
  right: string | callObject;
};

export type testCaseObject = {
  type: string;
  name: string;
  statements: [];
};

export type assertEqualObject = {
  type: string;
  target: string | callObject;
  toEqual: string | callObject;
};

export type setupTeardownObject = {
  type: string;
  name: string;
  statements: [];
};

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
