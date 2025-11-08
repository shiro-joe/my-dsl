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

class GeneratorFactory {
  // singleton
  // private static generatorFactory: GeneratorFactory;
  // private constructor() {}
  // public static getGeneratorFactory(): GeneratorFactory {
  //     if (!this.generatorFactory) {
  //         this.generatorFactory = new GeneratorFactory();
  //     }
  //     return this.generatorFactory;
  // }

  // 各generator管理
  private static jestCodeGenerator: Generator;
  private static unittestCodeGenerator: Generator;
  private static junitCodeGenerator: Generator;

  public static getJestCodeGenerator(): Generator {
    if (!this.jestCodeGenerator) {
      this.jestCodeGenerator = new JestCodeGenerator();
    }
    return this.jestCodeGenerator;
  }

  public static getUnittestCodeGenerator(): Generator {
    if (!this.unittestCodeGenerator) {
      this.unittestCodeGenerator = new UnittestCodeGenerator();
    }
    return this.unittestCodeGenerator;
  }

  public static getJUnitCodeGenerator(): Generator {
    if (!this.junitCodeGenerator) {
      this.junitCodeGenerator = new JUnitCodeGenerator();
    }
    return this.junitCodeGenerator;
  }
}

interface Generator {
  generateCodeFromObj: (element: object) => string;
}

class JestCodeGenerator implements Generator {
  public constructor() {}
  public generateCodeFromObj = (element: object) => {
    console.log(element);
    return "a";
  };
}

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

const a = GeneratorFactory.getJUnitCodeGenerator();
a.generateCodeFromObj({});
