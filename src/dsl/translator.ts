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
    let right;
    if (typeof obj.right === "object") {
      right = this.translateCallObject(obj.right);
    } else {
      right = obj.right;
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
    if (typeof obj.target === "object") {
      target = this.translateCallObject(obj.target);
    } else {
      target = obj.target;
    }
    if (typeof obj.toEqual === "object") {
      toEqual = this.translateCallObject(obj.toEqual);
    } else {
      toEqual = obj.toEqual;
    }
    return this.generator.generateAssertEqualCode(target, toEqual);
  };

  // assert same 参照同一性
  private translateAssertSameObject = (obj: AssertSameObject) => {
    let target: string, toBe: string;
    if (typeof obj.target === "object") {
      target = this.translateCallObject(obj.target);
    } else {
      target = obj.target;
    }
    if (typeof obj.toBe === "object") {
      toBe = this.translateCallObject(obj.toBe);
    } else {
      toBe = obj.toBe;
    }
    return this.generator.generateAssertSameCode(target, toBe);
  };

  // assert t/f
  private translateAssertTrueObject = (obj: AssertTrueObject) => {
    let target: string;
    if (typeof obj.target === "object") {
      target = this.translateCallObject(obj.target);
    } else {
      target = obj.target;
    }
    return this.generator.generateAssertTrueCode(target);
  };
  private translateAssertFalseObject = (obj: AssertFalseObject) => {
    let target: string;
    if (typeof obj.target === "object") {
      target = this.translateCallObject(obj.target);
    } else {
      target = obj.target;
    }
    return this.generator.generateAssertFalseCode(target);
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
    declare: this.translateDeclareObject,
    fixture: this.translateSetupTeardownObject,
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
