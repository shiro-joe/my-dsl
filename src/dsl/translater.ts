"use strict";

import type {
  callObject,
  fixtureObject,
  assignObject,
  testCaseObject,
  assertEqualObject,
  declareObject,
} from "./ir.js";
import { JestCodeGenerator } from "./jest-generator.js";
import { JUnitCodeGenerator } from "./junit-generator.js";
import { UnittestCodeGenerator } from "./unittest-generator.js";
import type { Generator } from "./generator.ts";

import fs from "node:fs";

const obj = JSON.parse(fs.readFileSync("./ir.json", "utf-8"));

// 変換実行するクラス

class Translater {
  // コンストラクタ
  private generator: Generator;
  private object: fixtureObject;
  private translatedCode: string = "no result";
  public constructor(generator: Generator, object: fixtureObject) {
    this.generator = generator;
    this.object = object;
    this.translatedCode = this.translateFixtureObject(this.object);
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

  // fixture
  private readonly translateFixtureObject = (obj: fixtureObject) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateFixtureCode(obj.name, res);
  };

  // test case
  private readonly translateTestCaseObject = (obj: testCaseObject) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateTestCaseCode(obj.name, res);
  };

  // assign
  private readonly translateAssignObject = (obj: assignObject) => {
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
  private translateCallObject = (obj: callObject) => {
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
  private translateDeclareObject = (obj: declareObject) => {
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
  private translateAssertEqualObject = (obj: assertEqualObject) => {
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

  // typeと関数の割り当て
  private readonly keyMap = {
    assign: this.translateAssignObject,
    call: this.translateCallObject,
    testCase: this.translateTestCaseObject,
    assertEqual: this.translateAssertEqualObject,
    declare: this.translateDeclareObject,
  };
  private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
    Object.hasOwn(this.keyMap, key);
}

// test

const gen = new JestCodeGenerator();

const test = new Translater(gen, obj as fixtureObject);
console.log(test.getTranslatedCode());

console.log("\njunit\n");

const java = new JUnitCodeGenerator();
const test2 = new Translater(java, obj as fixtureObject);
console.log(test2.getTranslatedCode());

console.log("\nunittest\n");
const py = new UnittestCodeGenerator();
const test3 = new Translater(py, obj as fixtureObject);
console.log(test3.getTranslatedCode());
