"use strict";

const obj = {
  type: "file",
  name: "file name",
  statements: [
    {
      type: "assign",
      left: "x",
      right: "2",
    },
    {
      type: "assign",
      left: "y",
      right: {
        type: "call",
        target: "func",
        args: ["1", "3"],
      },
    },
    {
      type: "beforeAll",
      name: "do this before all tests",
      statements: [],
    },
    {
      type: "testCase",
      name: "test_1",
      statements: [
        {},
        {
          type: "assertEqual",
          target: {
            type: "call",
            target: "add",
            args: [
              {
                type: "call",
                target: "func",
                args: ["2", "10"],
              },
              3,
            ],
          },
          tobe: "12",
        },
      ],
    },
    {
      type: "testCase",
      name: "test_2",
      statements: [],
    },
  ],
};

enum TYPE {
  FILE = "file",
  ASSIGN = "assign",
  CALL = "call",
  TEST_CASE = "testCase",
  ASSERT_EQUAL = "assertEqual",
}

type fileObject = {
  type: TYPE.FILE;
  name: string;
  statements: [];
};

type assignObject = {
  type: TYPE.ASSIGN;
  left: string;
  right: string | callObject;
};

type callObject = {
  type: TYPE.CALL;
  target: string;
  args: [];
};

type testCaseObject = {
  type: TYPE.TEST_CASE;
  name: string;
  statements: [];
};

type assertEqualObject = {
  type: TYPE.ASSERT_EQUAL;
  target: string | callObject;
  tobe: string | callObject;
};

// コードが文字列で返ってくる
interface Generator {
  generateAssignCode: (left: string, right: string) => string;
  generateCallCode: (target: string, args: string[]) => string;
  generateAssertEqualCode: (target: string, tobe: string) => string;
  generateTestCaseCode: (name: string, statements: string[]) => string;
  generateFileCode: (name: string, statements: string[]) => string;
}

// Jest用
class JestCodeGenerator implements Generator {
  public constructor() {}
  public generateAssignCode = (left: string, right: string) => {
    return `${left} = ${right}`;
  };
  public generateCallCode = (target: string, args: string[]) => {
    return `${target}(${args.join(", ")})`;
  };
  public generateTestCaseCode = (
    name: string,
    statements: string[],
  ): string => {
    return `test(${name}, () => { ${statements.join("; ")} })`;
  };
  public generateAssertEqualCode = (target: string, tobe: string): string => {
    return `expect(${target}).tobe(${tobe})`;
  };
  public generateFileCode = (name: string, statements: string[]) => {
    return `${name}\n${statements.join("; ")}`;
  };
}
/*
class UnittestCodeGenerator implements Generator {
  public constructor() {}
  public generateCodeFromObj = (element: object) => {
    console.log(element);
    return "b";
  };
  public generateAssignCode = (left: string, right: string) => {
    return `${left} = ${right}`;
  };
  public generateCallCode = (target: string, args: string[]) => {
    return `${target}(${args.join(", ")})`;
  };
}

class JUnitCodeGenerator implements Generator {
  public constructor() {}
  public generateCodeFromObj = (element: object) => {
    console.log(element);
    return "c";
  };
  public generateAssignCode = (left: string, right: string) => {
    return `${left} = ${right}`;
  };
  public generateCallCode = (target: string, args: string[]) => {
    return `${target}(${args.join(", ")})`;
  };
}
*/
// main部分

class Translater {
  // コンストラクタ
  private generator: Generator;
  private object: fileObject;
  private translatedCode: string = "no result";
  public constructor(generator: Generator, object: fileObject) {
    this.generator = generator;
    this.object = object;
    this.translatedCode = this.translateFileObject(this.object);
  }

  // 変換済みコード取得
  public getTranslatedCode(): string {
    return this.translatedCode;
  }

  // 以下 object読み
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
    res.push("");
    return res;
  };
  private readonly translateFileObject = (obj: fileObject) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateFileCode(obj.name, res);
  };
  private readonly translateTestCaseObject = (obj: testCaseObject) => {
    const res = this.translateStatementArray(obj.statements);
    return this.generator.generateTestCaseCode(obj.name, res);
  };
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

  private translateAssertEqualObject = (obj: assertEqualObject) => {
    let target: string, tobe: string;
    if (typeof obj.target === "object") {
      target = this.translateCallObject(obj.target);
    } else {
      target = obj.target;
    }
    if (typeof obj.tobe === "object") {
      tobe = this.translateCallObject(obj.tobe);
    } else {
      tobe = obj.tobe;
    }
    return this.generator.generateAssertEqualCode(target, tobe);
  };

  // typeと関数の割り当て
  private readonly keyMap = {
    assign: this.translateAssignObject,
    call: this.translateCallObject,
    testCase: this.translateTestCaseObject,
    assertEqual: this.translateAssertEqualObject,
  };
  private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
    Object.hasOwn(this.keyMap, key);
}

// test

const gen = new JestCodeGenerator();

const test = new Translater(gen, obj as fileObject);
console.log(test.getTranslatedCode());
