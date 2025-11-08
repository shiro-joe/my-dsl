"use strict";

/*
const obj = {
    "type" : "file",
    "name" : "file name",
    "statements" : [
        {
            "type" : "assign",
            "left" : "x",
            "right" : "2"
        },
        {
            "type" : "assign",
            "left" : "y",
            "right" : {
                "type" : "call",
                "target" : "func",
                "args" : ["1", "3"]
            }
        },
        {
            "type" : "beforeAll",
            "name" : "do this before all tests",
            "statements" : [

            ]
        },
        {
            "type" : "case",
            "name" : "test_1",
            "statements" : [
                {

                },
                {
                    "type" : "assert(equal)",
                    "target" : {
                        "type" : "call",
                        "target" : "add",
                        "args" : [
                            {
                                "type" : "call",
                                "target" : "func",
                                "args" : ["2", "10"]
                            }, 3
                        ]
                    },
                    "tobe" : "12"
                }
            ]
        },
        {
            "type" : "case",
            "name" : "test_2",
            "statements" : [

            ]
        }
    ]
};
*/

// enum BLOCK_TYPE {
//   FILE = "file",
// }
enum STATEMENT_TYPE {
  ASSIGN = "assign",
  CALL = "call",
  TEST_CASE = "testCase",
  ASSERT_EQUAL = "assertEqual",
}

type assignObject = {
  type: STATEMENT_TYPE.ASSIGN;
  left: string;
  right: string | callObject;
};

type callObject = {
  target: string;
  args: [];
};

// type testCaseObject = {
//   name: string;
//   statements: [];
// };

// type assertEqualObject = {
//   target: string | callObject;
//   tobe: string | callObject;
// };

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
}

// Jest用
class JestCodeGenerator implements Generator {
  public constructor() {}
  public generateCodeFromObj = (element: object) => {
    // console.log(element);
    console.log(this.generateAssignCode(element as assignObject));
    return "a";
  };
  private generateAssignCode(obj: assignObject): string {
    const left: string = obj.left;
    let right: string;
    if (typeof obj.right === "object") {
      right = this.generateCallCode(obj.right);
    } else {
      right = obj.right;
    }
    return `${left} = ${right}`;
  }
  private generateCallCode(obj: callObject): string {
    const args: string[] = [];
    const target = obj.target;
    for (const arg of obj.args) {
      if (typeof arg === "object") {
        args.push(this.generateCallCode(arg));
      } else {
        args.push(arg);
      }
    }
    return `${target}(${args.join(",")})`;
  }
  /*
  private generateTestCaseCode(obj: testCaseObject): string {
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
}

class JUnitCodeGenerator implements Generator {
  public constructor() {}
  public generateCodeFromObj = (element: object) => {
    console.log(element);
    return "c";
  };
}
*/

// main部分
/*
class GenerationController {
    private generator: Generator;
    private object: object;
    public constructor(generator: Generator, object: object) {
        this.generator = generator;
        this.object = object;
    }
}
*/

// test

const test = new JestCodeGenerator();
test.generateCodeFromObj({
  type: "assign",
  left: "y",
  right: {
    type: "call",
    target: "func",
    args: ["1", "3"],
  },
});
