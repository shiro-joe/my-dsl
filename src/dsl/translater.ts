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
      type: "case",
      name: "test_1",
      statements: [
        {},
        {
          type: "assert(equal)",
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
      type: "case",
      name: "test_2",
      statements: [],
    },
  ],
};

// enum BLOCK_TYPE {
//   FILE = "file",
// }
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
/*
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
*/
// class GeneratorManager {
//   // 各generator管理
//   private static jestCodeGenerator: Generator;
//   private static unittestCodeGenerator: Generator;
//   private static junitCodeGenerator: Generator;

//   public static getJestCodeGenerator(): Generator {
//     if (!this.jestCodeGenerator) {
//       this.jestCodeGenerator = new JestCodeGenerator();
//     }
//     return this.jestCodeGenerator;
//   }

//   public static getUnittestCodeGenerator(): Generator {
//     if (!this.unittestCodeGenerator) {
//       this.unittestCodeGenerator = new UnittestCodeGenerator();
//     }
//     return this.unittestCodeGenerator;
//   }

//   public static getJUnitCodeGenerator(): Generator {
//     if (!this.junitCodeGenerator) {
//       this.junitCodeGenerator = new JUnitCodeGenerator();
//     }
//     return this.junitCodeGenerator;
//   }
// }

// generateCodeFromObjを持つ
// objectを投げたらコードが文字列で返ってくる
interface Generator {
  generateCodeFromObj: (element: object) => string;
  generateAssignCode: (left: string, right: string) => string;
  generateCallCode: (target: string, args: string[]) => string;
}

// Jest用
class JestCodeGenerator implements Generator {
  public constructor() {}
  public generateCodeFromObj = (element: object) => {
    console.log(element);
    //console.log(this.generateAssignCode(element as assignObject));
    return "a";
  };
  public generateAssignCode = (left: string, right: string) => {
    return `${left} = ${right}`;
  };
  public generateCallCode = (target: string, args: string[]) => {
    return `${target}(${args.join(", ")})`;
  };
  /*
  private generateTestCaseCode(obj: testCaseObject): string {
    const name = obj.name;

    return "test case";
  }
  private generateAssertEqualCode(obj: assertEqualObject): string {
    return "assert equal";
  }
    */
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
  }

  // 変換済みコード取得
  public getTranslatedCode(): string {
    this.translateFileObject(this.object);
    return this.translatedCode;
  }

  // 以下 object読み
  private readonly translateFileObject = (obj: fileObject) => {
    const res = [];
    for (const statement of obj.statements) {
      const type = Object.values(statement)[0] as string;
      if (this.isKey(type)) {
        res.push(this.keyMap[type](statement));
      } else {
        res.push("変換不可能");
      }
    }
    res.push("");
    this.translatedCode = res.join("; ");
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

  // typeと関数の割り当て
  private readonly keyMap = {
    assign: this.translateAssignObject,
    call: this.translateCallObject,
  };
  private readonly isKey = (key: string): key is keyof typeof this.keyMap =>
    Object.hasOwn(this.keyMap, key);
}

// test

const gen = new JestCodeGenerator();

const test = new Translater(gen, obj as fileObject);
console.log(test.getTranslatedCode());
