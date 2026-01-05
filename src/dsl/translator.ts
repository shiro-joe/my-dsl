"use strict";

import type {
  CallObject,
  FileObject,
  fixtureObject,
  AssignObject,
  TestCaseObject,
  SkippedTestCaseObject,
  AssertEqualObject,
  DeclareObject,
  AssertSameObject,
  AssertFalseObject,
  AssertTrueObject,
  AssertNullObject,
  AssertThrowObject,
  RawLangObject,
} from "./ir.js";
import { JestCodeGenerator } from "./jest-generator.js";
import { JUnitCodeGenerator } from "./junit-generator.js";
import { UnittestCodeGenerator } from "./unittest-generator.js";
import { PytestCodeGenerator } from "./pytest-generator.js";
import type { Generator } from "./generator.ts";

import fs from "node:fs";

const obj = JSON.parse(fs.readFileSync("./ir.json", "utf-8"));

// 変換実行するクラス

class Translator {
  // コンストラクタ
  private generator: Generator;
  private object: FileObject;
  private translatedCode: string = "no result";
  public constructor(generator: Generator, object: FileObject) {
    this.generator = generator;
    this.object = object;
    this.translatedCode = this.translateFileObject(this.object);
  }

  // 変換済みコード取得
  public getTranslatedCode(): string {
    return this.translatedCode;
  }

  // 以下 object読み

  // statements[]
  private readonly translateStatementArray = (statements: []) => {
    const res: string[] = [];
    for (const statement of statements) {
      const type = Object.values(statement)[0] as string;
      if (this.isKey(type)) {
        res.push(this.keyMap[type](statement));
      } else {
        res.push("変換不可能");
      }
    }
    return res;
  };

  // file
  private readonly translateFileObject = (obj: FileObject) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateFileCode(obj.name, res);
  };

  // setup/teardown
  private readonly translateSetupTeardownObject = (obj: fixtureObject) => {
    return this.generator.generateSetupTeardownCode(
      [
        obj.beforeAll.name,
        this.translateStatementArray(obj.beforeAll.statements),
      ],
      [
        obj.beforeEach.name,
        this.translateStatementArray(obj.beforeEach.statements),
      ],
      [
        obj.afterAll.name,
        this.translateStatementArray(obj.afterAll.statements),
      ],
      [
        obj.afterEach.name,
        this.translateStatementArray(obj.afterEach.statements),
      ],
    );
  };

  // test case
  private readonly translateTestCaseObject = (obj: TestCaseObject) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateTestCaseCode(obj.name, res);
  };

  // skip test case
  private readonly translateSkippedTestCaseObject = (
    obj: SkippedTestCaseObject,
  ) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateSkippedTestCaseCode(obj.name, res);
  };

  // assign
  private readonly translateAssignObject = (obj: AssignObject) => {
    const left: string = obj.left;
    let right: string;
    if (typeof obj.right === "object") {
      right = this.translateCallObject(obj.right);
    } else {
      right = obj.right;
    }
    return this.generator.generateAssignCode(left, right);
  };

  // call
  private translateCallObject = (obj: CallObject) => {
    const args: string[] = [];
    const target = obj.target;
    for (const arg of obj.args) {
      if (typeof arg === "object") {
        args.push(this.translateCallObject(arg));
      } else {
        args.push(arg);
      }
    }
    return this.generator.generateCallCode(target, args);
  };

  // declare
  private translateDeclareObject = (obj: DeclareObject) => {
    const type = obj.data_type;
    const left = obj.left;
    let right: string;
    if (typeof obj.right === "string") {
      right = obj.right;
    } else {
      const type = obj.right.type;
      if (this.isKey(type)) {
        right = this.keyMap[type](obj.right as any);
      } else {
        right = "変換不可能";
      }
    }
    if (right === "") {
      return this.generator.generateDeclareCode(type, left);
    } else {
      return this.generator.generateDeclareAndInitializeCode(type, left, right);
    }
  };

  // assert equal
  private translateAssertEqualObject = (obj: AssertEqualObject) => {
    let target: string, toEqual: string;
    if (typeof obj.target === "string") {
      target = obj.target;
    } else {
      const type = obj.target.type;
      if (this.isKey(type)) {
        target = this.keyMap[type](obj.target as any);
      } else {
        target = "変換不可能";
      }
    }
    if (typeof obj.toEqual === "string") {
      toEqual = obj.toEqual;
    } else {
      const type = obj.toEqual.type;
      if (this.isKey(type)) {
        toEqual = this.keyMap[type](obj.toEqual as any);
      } else {
        toEqual = "変換不可能";
      }
    }
    const delta = Number(obj.delta);
    return this.generator.generateAssertEqualCode(target, toEqual, delta);
  };

  // assert same 参照同一性
  private translateAssertSameObject = (obj: AssertSameObject) => {
    let target: string, toBe: string;
    if (typeof obj.target === "object") {
      const type = obj.target.type;
      if (this.isKey(type)) {
        target = this.keyMap[type](obj.target as any);
      } else {
        target = "変換不可能";
      }
    } else {
      target = obj.target;
    }
    if (typeof obj.toBe === "object") {
      const type = obj.toBe.type;
      if (this.isKey(type)) {
        toBe = this.keyMap[type](obj.toBe as any);
      } else {
        toBe = "変換不可能";
      }
    } else {
      toBe = obj.toBe;
    }
    return this.generator.generateAssertSameCode(target, toBe);
  };

  // assert t/f
  private translateAssertTrueObject = (obj: AssertTrueObject) => {
    let target: string;
    if (typeof obj.target === "object") {
      const type = obj.target.type;
      if (this.isKey(type)) {
        target = this.keyMap[type](obj.target as any);
      } else {
        target = "変換不可能";
      }
    } else {
      target = obj.target;
    }
    return this.generator.generateAssertTrueCode(target);
  };
  private translateAssertFalseObject = (obj: AssertFalseObject) => {
    let target: string;
    if (typeof obj.target === "object") {
      const type = obj.target.type;
      if (this.isKey(type)) {
        target = this.keyMap[type](obj.target as any);
      } else {
        target = "変換不可能";
      }
    } else {
      target = obj.target;
    }
    return this.generator.generateAssertFalseCode(target);
  };

  // null
  private translateAssertNullObject = (obj: AssertNullObject) => {
    let target: string;
    if (typeof obj.target === "object") {
      const type = obj.target.type;
      if (this.isKey(type)) {
        target = this.keyMap[type](obj.target as any);
      } else {
        target = "変換不可能";
      }
    } else {
      target = obj.target;
    }
    return this.generator.generateAssertNullCode(target);
  };

  // 例外
  private translateAssertThrowObject = (obj: AssertThrowObject) => {
    let target: string, error: string;
    if (typeof obj.target === "object") {
      const type = obj.target.type;
      if (this.isKey(type)) {
        target = this.keyMap[type](obj.target as any);
      } else {
        target = "変換不可能";
      }
    } else {
      target = obj.target;
    }
    if (typeof obj.error === "object") {
      const type = obj.error.type;
      if (this.isKey(type)) {
        error = this.keyMap[type](obj.error as any);
      } else {
        error = "変換不可能";
      }
    } else {
      error = obj.error;
    }
    return this.generator.generateAssertThrowCode(target, error);
  };

  // 生
  private translateRawLangObject = (obj: RawLangObject) => {
    return this.generator.generateRawLangCode(obj.lang, obj.content);
  };

  // typeと関数の割り当て
  private readonly keyMap = {
    assign: this.translateAssignObject,
    call: this.translateCallObject,
    testCase: this.translateTestCaseObject,
    skippedTestCase: this.translateSkippedTestCaseObject,
    assertEqual: this.translateAssertEqualObject,
    assertSame: this.translateAssertSameObject,
    assertTrue: this.translateAssertTrueObject,
    assertFalse: this.translateAssertFalseObject,
    assertNull: this.translateAssertNullObject,
    assertThrow: this.translateAssertThrowObject,
    declare: this.translateDeclareObject,
    fixture: this.translateSetupTeardownObject,
    rawLang: this.translateRawLangObject,
    // beforeAll: this.translateSetupTeardownObject,
    // beforeEach: this.translateSetupTeardownObject,
    // afterAll: this.translateSetupTeardownObject,
    // afterEach: this.translateSetupTeardownObject,
  };
  private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
    Object.hasOwn(this.keyMap, key);
}

// test

const gen = new JestCodeGenerator();

const test = new Translator(gen, obj as FileObject);
console.log(test.getTranslatedCode());

console.log("\njunit\n");

const java = new JUnitCodeGenerator();
const test2 = new Translator(java, obj as FileObject);
console.log(test2.getTranslatedCode());

console.log("\nunittest\n");
const py = new UnittestCodeGenerator();
const test3 = new Translator(py, obj as FileObject);
console.log(test3.getTranslatedCode());

console.log("\npytest\n");
const pyte = new PytestCodeGenerator();
const test4 = new Translator(pyte, obj as FileObject);
console.log(test4.getTranslatedCode());
