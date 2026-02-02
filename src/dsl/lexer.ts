
class Compiler {
  private readonly notKeyword = new Set([
    TokenKind.COMMA,
    TokenKind.IDENTIFIER,
    TokenKind.LITERAL,
    TokenKind.LEFT_BRACE,
    TokenKind.RIGHT_BRACE,
    TokenKind.END_PROGRAM,
  ]);
  private readonly langKeyword = new Set([
    TokenKind.JS,
    TokenKind.JAVA,
    TokenKind.PYTHON,
  ]);
  private readonly skipChar = new Set([" ", "\t", "\n", "\r"]);
  private readonly keywordMap = new Map<string, TokenKind>([
    ["{", TokenKind.LEFT_BRACE],
    ["}", TokenKind.RIGHT_BRACE],
    [",", TokenKind.COMMA],
    ["AfterAll", TokenKind.AFTERALL],
    ["AfterEach", TokenKind.AFTEREACH],
    ["BeforeAll", TokenKind.BEFOREALL],
    ["BeforeEach", TokenKind.BEFOREEACH],
    ["Test", TokenKind.TEST_CASE],
    ["SkippedTest", TokenKind.SKIPPED_TEST_CASE],
    ["equal", TokenKind.ASSERT_EQUAL],
    ["same", TokenKind.ASSERT_SAME],
    ["true", TokenKind.ASSERT_TRUE],
    ["false", TokenKind.ASSERT_FALSE],
    ["null", TokenKind.ASSERT_NULL],
    ["throw", TokenKind.ASSERT_THROW],
    ["JS", TokenKind.JS],
    ["Python", TokenKind.PYTHON],
    ["Java", TokenKind.JAVA],
  ]);
  private readonly toIRMap = new Map<TokenKind, string>([
    [TokenKind.TEST_CASE, "testCase"],
    [TokenKind.SKIPPED_TEST_CASE, "skippedTestCase"],
    [TokenKind.ASSERT_EQUAL, "assertEqual"],
    [TokenKind.ASSERT_SAME, "assertSame"],
    [TokenKind.ASSERT_TRUE, "assertTrue"],
    [TokenKind.ASSERT_FALSE, "assertFalse"],
    [TokenKind.ASSERT_NULL, "assertNull"],
    [TokenKind.ASSERT_THROW, "assertThrow"],
  ]);
  public constructor() {}
  public compile(rawCode: string) {
    let ch: string;
    let pos: number = 0;
    let line: number = 1;
    let tokenArr: Token[] = [];
    let blocks: Block[] = [];
    const length = rawCode.length;
    while (pos < length) {
      ch = rawCode[pos] as string;
      pos++;
      if (this.skipChar.has(ch)) {
        if (ch == "\r") {
          line++;
        }
        continue;
      } else if (ch == "{") {
        tokenArr.push(new Token(TokenKind.LEFT_BRACE, ch, pos - 1, pos - 1));
      } else if (ch == "}") {
        tokenArr.push(new Token(TokenKind.RIGHT_BRACE, ch, pos - 1, pos - 1));
      } else if (ch == ",") {
        tokenArr.push(new Token(TokenKind.COMMA, ch, pos - 1, pos - 1));
      } else if (ch >= "0" && ch <= "9") {
        // 数字の場合
        let num: string = "";
        let numPos = pos;
        // 0～9が続く限りnumに1文字ずつ追加していく
        while (pos < length && ch >= "0" && ch <= "9") {
          num += ch;
          ch = rawCode[pos] as string;
          pos++;
        }
        pos--;
        // 0～9の連続が終わって違う文字が出てきたら、「数字」tokenをtokenArrに追加。
        tokenArr.push(new Token(TokenKind.LITERAL, num, numPos, pos));
        // 次の文字はrawCode[pos]。外側whileでchに代入される。
      } else {
        // 文字列？の場合
        let identifier = "";
        let idPos = pos - 1;
        let idEnd = pos - 1;
        // 空白文字、｛｝以外が続く限りidentifierに1文字ずつ追加していく
        while (
          pos < length &&
          !this.skipChar.has(ch) &&
          ch != "{" &&
          ch != "}" &&
          ch != ","
        ) {
          identifier += ch;
          ch = rawCode[pos] as string;
          pos++;
          idEnd++;
        }
        pos--;
        if (!this.keywordMap.has(identifier)) {
          tokenArr.push(
            new Token(TokenKind.IDENTIFIER, identifier, idPos, idEnd - 1),
          );
        } else {
          tokenArr.push(
            new Token(
              this.keywordMap.get(identifier) as TokenKind,
              identifier,
              idPos,
              idEnd - 1,
            ),
          );
        }
      }
    }
    tokenArr.push(new Token(TokenKind.END_PROGRAM, "", pos, pos));
    let tokens: Token[] = [];
    for (let i = 0; i < tokenArr.length; i++) {
      if (this.langKeyword.has(tokenArr[i]?.kind as TokenKind)) {
        tokens.push(tokenArr[i] as Token);
        i++;
        if (tokenArr[i]?.kind != TokenKind.LEFT_BRACE) {
          throw new Error("syntax error");
        }

        tokens.push(tokenArr[i] as Token);
        i++;
                let token = tokenArr[i] as Token;
        let braceCnt = 1;
        let rawPos: number = token.pos;
        let rawEnd: number = token.end;
        while (braceCnt != 0) {
          if (i >= tokenArr.length) {
            throw new Error("syntax error");
          }
          if (tokenArr[i]?.kind == TokenKind.LEFT_BRACE) {
            braceCnt++;
          } else if (tokenArr[i]?.kind == TokenKind.RIGHT_BRACE) {
            braceCnt--;
          }
            i++;    
        }
        i--;
        rawEnd = tokenArr[i-1]?.end as number;
        tokens.push(
          new Token(
            TokenKind.IDENTIFIER,
            rawCode.slice(rawPos, rawEnd + 1),
            rawPos,
            rawEnd,
          ),
        );
        tokens.push(tokenArr[i] as Token);
      } else if (
        tokenArr[i]?.kind == TokenKind.TEST_CASE ||
        tokenArr[i]?.kind == TokenKind.SKIPPED_TEST_CASE
      ) {
        tokens.push(tokenArr[i] as Token);
        let token = tokenArr[i] as Token;
        let namePos = token.pos;
        let nameEnd = token.end;
        i++;
        let name: string = "";
        while (tokenArr[i]?.kind != TokenKind.LEFT_BRACE) {
            console.log("a")
          if (i >= tokenArr.length) {
            throw new Error("syntax error");
          }
          name += `${tokenArr[i]?.text} `;
          nameEnd = tokenArr[i]?.end as number;
          i++;
        }
        if (name != "") {
          tokens.push(new Token(TokenKind.IDENTIFIER, name, namePos, nameEnd));
        }
        tokens.push(tokenArr[i] as Token)
      } else {
        tokens.push(tokenArr[i] as Token);
      }
    }
    // console.log(tokens);
    // ここから、tokensをirに変換します！頑張れ！
    this.parse(tokens, "a")

    // try{
    //     blocks = this.parse(tokenArr)
    // } catch (e) {
    //     //いったん上になげとく
    //     throw e;
    // }
    // console.log(blocks)
    //let ir = this.toIR(blocks)
  }
  private parse(tokens: Token[], name: string) {
    let resIR = {
        type: "file",
        name: name,
        statements: [] as object[]
    }
    let blankFixtureObject = {
        name: "",
        statements: []
    }
    resIR.statements.push({
        type: "fixture",
        beforeAll: blankFixtureObject,
        beforeEach: blankFixtureObject,
        afterAll: blankFixtureObject,
        afterEach: blankFixtureObject
    })
    let pos = 0;
    const length = tokens.length;
    const addPos = (): boolean => {
        pos++;
        if(pos < length){
            return true
        } else {
            throw new Error("syntax error")
            return false
        }
    }
    const makeObject = (): any => {
        let res: object = {};
        let token: Token = tokens[pos] as Token;
        let target;
        let x;
        addPos();
        switch (token.kind) {
            case TokenKind.TEST_CASE:
                console.log("testcase")
                token = tokens[pos] as Token
                addPos();
                let testCaseObj = {
                    type: "testCase",
                    name: token.text,
                    statements: [] as any
                }
                token = tokens[pos] as Token
                addPos();
                while(token.kind != TokenKind.RIGHT_BRACE) {
                    testCaseObj.statements.push(makeObject());
                    token = tokens[pos] as Token
                    addPos();
                }
                res = testCaseObj;
                console.log(res)
            case TokenKind.SKIPPED_TEST_CASE:
                console.log("testcase")
                token = tokens[pos] as Token
                addPos();
                let skippedTestCaseObj = {
                    type: "skippedTestCase",
                    name: token.text,
                    statements: [] as any
                }
                token = tokens[pos] as Token
                addPos();
                while(token.kind != TokenKind.RIGHT_BRACE) {
                    skippedTestCaseObj.statements.push(makeObject());
                    token = tokens[pos] as Token
                    addPos();
                }
                res = skippedTestCaseObj;
                console.log(res)
            case TokenKind.ASSERT_EQUAL:
                // いまposが{を指してるはず、次がターゲット、その次が比較先
                addPos();
                target = makeObject();
                addPos();
                x = makeObject();
                x = tokens[pos] as Token;
                let assertEqualObj = {
                    type: "assertEqual",
                    target: target,
                    toEqual: x
                }
                res = assertEqualObj
            default:
                while(token.kind != TokenKind.RIGHT_BRACE) {
                    token = tokens[pos] as Token
                    addPos();
                }
                console.log("その他")

        }
        return res;
    }
    while(pos < length) {
        resIR.statements.push(makeObject())
    }
    console.log(resIR)
    return resIR;
  }
  // private parse(tokenArr: Token[]) {
  //     let pos = 0;
  //     let current: Token;
  //     let length = tokenArr.length;
  //     let structure: Block[] = [];// blockの配列（入れ子）。オブジェクト一つ分にあたる
  //     const parseBlock = ():Block => {
  //         // console.log("call parseBlock")
  //         // console.log(current);
  //         if(this.notKeyword.has(current.kind)) {
  //             //throw new Error("syntax error")
  //             return new Block(current, []);
  //         } else if(this.langKeyword.has(current.kind)) {
  //             // 現在のTOKEN（生言語TOKEN）保存
  //             const tmp = current;
  //             // 次のトークンは「｛」
  //             current = tokenArr[pos] as Token;
  //             pos ++;
  //             // posがオーバーしてたらアウト
  //             if (pos >= length) {
  //                 throw new Error("syntax error")
  //             }
  //             let rawCodePos = (tokenArr[pos] as Token).pos;
  //             let rawCodeEnd = rawCodePos;
  //             // ｛だったらおけ、それ以外だとエラー
  //             if(current.kind == TokenKind.LEFT_BRACE) {
  //                 // {が閉じるかどうか見る。最初1、0になったらこのトークンのブロックおわり
  //                 let braceCnt: number = 1;
  //                 // ｛が閉じるまで無視
  //                 while(braceCnt != 0) {
  //                     // ｛閉じてないのに終わったらだめ
  //                     if (pos >= length) {
  //                         throw new Error("syntax error")
  //                     }
  //                     current = tokenArr[pos] as Token;
  //                     pos ++;
  //                     if(current.kind == TokenKind.LEFT_BRACE) {
  //                         braceCnt ++;
  //                     } else if (current.kind == TokenKind.RIGHT_BRACE) {
  //                         braceCnt --;
  //                     } else {
  //                         rawCodeEnd = current.end;
  //                     }
  //                 }
  //             } else {
  //                 throw new Error("syntax error");
  //             }
  //             return new Block(new Token(tmp.kind, "", rawCodePos, rawCodeEnd), []);
  //         } else if(current.kind == TokenKind.TEST_CASE || current.kind == TokenKind.SKIPPED_TEST_CASE){
  //             const tmp: Token = current;
  //             let children: Block[] = [];
  //             let namePos: number = tmp.pos;
  //             let nameEnd: number = tmp.end;
  //             current = tokenArr[pos] as Token;
  //             pos++;
  //             if(pos >= length) {
  //                 throw new Error("syntax error");
  //             }
  //             while(pos < length && current.kind == TokenKind.IDENTIFIER) {
  //                 nameEnd = current.end;
  //                 current = tokenArr[pos] as Token;
  //                 pos ++;
  //             }
  //             if(current.kind == TokenKind.LEFT_BRACE) {
  //                 let braceCnt: number = 1;
  //                 while(braceCnt != 0) {
  //                     // ｛閉じてないのに終わったらだめ
  //                     if (pos >= length) {
  //                         throw new Error("syntax error")
  //                     }
  //                     current = tokenArr[pos] as Token;
  //                     pos ++;
  //                     if(current.kind == TokenKind.LEFT_BRACE) {
  //                         braceCnt ++;
  //                     } else if (current.kind == TokenKind.RIGHT_BRACE) {
  //                         braceCnt --;
  //                     } else if (current.kind == TokenKind.LITERAL) {
  //                         children.push(new Block(current, []));
  //                     } else if(current.kind == TokenKind.COMMA){

  //                     } else if(current.kind == TokenKind.IDENTIFIER){
  //                         throw new Error("syntax error")
  //                     } else {
  //                         children.push(parseBlock());
  //                     }
  //                 }
  //             } else {
  //                 throw new Error("syntax error")
  //             }
  //             return new Block(new Token(tmp.kind, "", namePos, nameEnd), children);
  //         }else {
  //             const tmp: Token = current;
  //             let children: Block[] = [];
  //             current = tokenArr[pos] as Token;
  //             pos ++;
  //             if(pos >= length) {
  //                 throw new Error("syntax error")
  //             }
  //             if(current.kind == TokenKind.LEFT_BRACE) {
  //                 let braceCnt: number = 1;
  //                 while(braceCnt != 0) {
  //                     // ｛閉じてないのに終わったらだめ
  //                     if (pos >= length) {
  //                         throw new Error("syntax error")
  //                     }
  //                     current = tokenArr[pos] as Token;
  //                     pos ++;
  //                     if(current.kind == TokenKind.LEFT_BRACE) {
  //                         braceCnt ++;
  //                     } else if (current.kind == TokenKind.RIGHT_BRACE) {
  //                         braceCnt --;
  //                     } else if (current.kind == TokenKind.LITERAL) {
  //                         children.push(new Block(current, []));
  //                     } else if(current.kind == TokenKind.COMMA){

  //                     } else if(current.kind == TokenKind.IDENTIFIER){
  //                         throw new Error("syntax error")
  //                     } else {
  //                         children.push(parseBlock());
  //                     }
  //                 }
  //             } else {
  //                 throw new Error("syntax error")
  //             }
  //             return new Block(tmp, children);
  //         }
  //     }
  //     while(pos < length) {
  //         current = tokenArr[pos] as Token
  //         pos ++;
  //         structure.push(parseBlock());
  //     }
  //     return structure;
  // }
  // private toIR(blocks: Block[]) {
  //     const fixtures = new Set([
  //         TokenKind.AFTERALL,
  //         TokenKind.AFTEREACH,
  //         TokenKind.BEFOREALL,
  //         TokenKind.BEFOREEACH
  //     ])
  //     let pos = 0;
  //     let block = blocks[pos] as Block;
  //     const length = blocks.length;
  //     pos ++;
  //     let statements = [];
  //     const blockToIRObject = (block: Block): any => {
  //         let kind = block.token.kind;
  //         let children = block.children;
  //         switch (kind) {
  //             case TokenKind.TEST_CASE || TokenKind.SKIPPED_TEST_CASE :
  //                 let caseStatements = []
  //                 let j = 0;
  //                 while(children[j]) {
  //                     caseStatements.push(blockToIRObject(children[j]))
  //                 }
  //                 return {
  //                     type: this.toIRMap.get(kind),
  //                     name: block.token.text,
  //                     statements: caseStatements
  //                 }
  //             case TokenKind.ASSERT_EQUAL:
  //                 if(children[2]) {
  //                     return {
  //                         type: this.toIRMap.get(kind),
  //                         target: blockToIRObject(children[0] as Block),
  //                         toEqual: blockToIRObject(children[1] as Block),
  //                         delta: blockToIRObject(children[2])
  //                     }
  //                 }
  //                 return {
  //                     type: this.toIRMap.get(kind),
  //                     target: blockToIRObject(children[0] as Block),
  //                     toEqual: blockToIRObject(children[1] as Block)
  //                 }
  //             case TokenKind.ASSERT_SAME:
  //                 return {
  //                     type: this.toIRMap.get(kind),
  //                     target: blockToIRObject(children[0] as Block),
  //                     toBe: blockToIRObject(children[1] as Block)
  //                 }
  //             case TokenKind.ASSERT_TRUE || TokenKind.ASSERT_FALSE || TokenKind.ASSERT_NULL :
  //                 return {
  //                     type: this.toIRMap.get(kind),
  //                     target: blockToIRObject(children[0] as Block)
  //                 }
  //             case TokenKind.ASSERT_THROW :
  //                 if (block.children[1]) {
  //                     return {
  //                         type: this.toIRMap.get(kind),
  //                         target: blockToIRObject(children[0] as Block),
  //                         error: blockToIRObject(children[1] as Block)
  //                     }
  //                 }
  //                 return {
  //                     type: this.toIRMap.get(kind),
  //                     target: blockToIRObject(children[0] as Block)
  //                 }
  //             case TokenKind.AFTERALL || TokenKind.AFTEREACH || TokenKind.BEFOREALL || TokenKind.BEFOREEACH :
  //                 let i = 0;
  //                 let fixStatements = [];
  //                 while(children[i]) {
  //                     fixStatements.push(blockToIRObject(children[i]))
  //                 }
  //                 return {
  //                     name: "",
  //                     statements: fixStatements
  //                 }
  //             case TokenKind.LITERAL :
  //                 return block.token.text
  //             case TokenKind.END_PROGRAM :
  //                 return
  //             case TokenKind.JS || TokenKind.JAVA || TokenKind.PYTHON :
  //                 return {
  //                     type: "rawLang",
  //                     content: block.token.text
  //                 }
  //         }
  //         return {}
  //     }
  //     while(this.langKeyword.has(block.token.kind) && pos < length) {
  //         statements.push({
  //             type: "rawLang",
  //             content: block.token.text
  //         })
  //         block = blocks[pos] as Block
  //         pos ++;
  //     }
  //     let beforeAll;
  //     let beforeEach;
  //     let afterAll;
  //     let afterEach;
  //     while(fixtures.has(block.token.kind) && pos < length) {
  //         if (block.token.kind == TokenKind.AFTERALL) {
  //             afterAll = blockToIRObject(block)
  //         } else if(block.token.kind == TokenKind.AFTEREACH) {
  //             afterEach = blockToIRObject(block)
  //         } else if(block.token.kind == TokenKind.BEFOREALL) {
  //             beforeAll = blockToIRObject(block)
  //         } else {
  //             beforeEach = blockToIRObject(block)
  //         }
  //         block = blocks[pos] as Block
  //         pos ++;
  //     }
  //     statements.push({
  //         type: "fixture",
  //         beforeAll: beforeAll,
  //         beforeEach: beforeEach,
  //         afterAll: afterAll,
  //         afterEach: afterEach
  //     })
  //     while(pos < length) {
  //         console.log(block)
  //         if(fixtures.has(block.token.kind)) {
  //             throw new Error("fixtureの位置が違う")
  //         }
  //         statements.push(blockToIRObject(block))
  //         block = blocks[pos] as Block
  //         pos ++;
  //     }
  //     return {
  //         type: "file",
  //         name: "",
  //         statements: statements
  //     }
  // }
}
enum TokenKind {
  IDENTIFIER,
  LITERAL,
  END_PROGRAM,
  LEFT_BRACE, // {
  RIGHT_BRACE, // }
  COMMA, // ,

  JS,
  PYTHON,
  JAVA,

  AFTERALL,
  AFTEREACH,
  BEFOREALL,
  BEFOREEACH,

  TEST_CASE,
  SKIPPED_TEST_CASE,
  ASSERT_EQUAL,
  ASSERT_SAME,
  ASSERT_TRUE,
  ASSERT_FALSE,
  ASSERT_NULL,
  ASSERT_THROW,
}

class Token {
  public constructor(
    public readonly kind: TokenKind,
    public readonly text: string,
    public readonly pos: number,
    public readonly end: number,
  ) {}
}

class Block {
  public constructor(
    public readonly token: Token,
    public readonly children: Block[],
  ) {}
}

const test = new Compiler();
test.compile(
  "JS{a{gg{}}} JS {const globalDatabase = makeGlobalDatabase();}\n\nAfterAll {\n  JS {globalDatabase.cleanUp();}\n}\n\nTest simple test {\n  JS {const results = globalDatabase.findAll()}\n  equal{JS {results.length}, 0}\n}",
);
