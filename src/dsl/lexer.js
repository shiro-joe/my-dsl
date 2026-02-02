var Compiler = /** @class */ (function () {
    function Compiler() {
        this.notKeyword = new Set([
            TokenKind.COMMA,
            TokenKind.IDENTIFIER,
            TokenKind.LITERAL,
            TokenKind.LEFT_BRACE,
            TokenKind.RIGHT_BRACE,
            TokenKind.END_PROGRAM,
        ]);
        this.langKeyword = new Set([
            TokenKind.JS,
            TokenKind.JAVA,
            TokenKind.PYTHON,
        ]);
        this.skipChar = new Set([" ", "\t", "\n", "\r"]);
        this.keywordMap = new Map([
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
        this.toIRMap = new Map([
            [TokenKind.TEST_CASE, "testCase"],
            [TokenKind.SKIPPED_TEST_CASE, "skippedTestCase"],
            [TokenKind.ASSERT_EQUAL, "assertEqual"],
            [TokenKind.ASSERT_SAME, "assertSame"],
            [TokenKind.ASSERT_TRUE, "assertTrue"],
            [TokenKind.ASSERT_FALSE, "assertFalse"],
            [TokenKind.ASSERT_NULL, "assertNull"],
            [TokenKind.ASSERT_THROW, "assertThrow"],
        ]);
    }
    Compiler.prototype.compile = function (rawCode) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var ch;
        var pos = 0;
        var line = 1;
        var tokenArr = [];
        var blocks = [];
        var length = rawCode.length;
        while (pos < length) {
            ch = rawCode[pos];
            pos++;
            if (this.skipChar.has(ch)) {
                if (ch == "\r") {
                    line++;
                }
                continue;
            }
            else if (ch == "{") {
                tokenArr.push(new Token(TokenKind.LEFT_BRACE, ch, pos - 1, pos - 1));
            }
            else if (ch == "}") {
                tokenArr.push(new Token(TokenKind.RIGHT_BRACE, ch, pos - 1, pos - 1));
            }
            else if (ch == ",") {
                tokenArr.push(new Token(TokenKind.COMMA, ch, pos - 1, pos - 1));
            }
            else if (ch >= "0" && ch <= "9") {
                // 数字の場合
                var num = "";
                var numPos = pos;
                // 0～9が続く限りnumに1文字ずつ追加していく
                while (pos < length && ch >= "0" && ch <= "9") {
                    num += ch;
                    ch = rawCode[pos];
                    pos++;
                }
                pos--;
                // 0～9の連続が終わって違う文字が出てきたら、「数字」tokenをtokenArrに追加。
                tokenArr.push(new Token(TokenKind.LITERAL, num, numPos, pos));
                // 次の文字はrawCode[pos]。外側whileでchに代入される。
            }
            else {
                // 文字列？の場合
                var identifier = "";
                var idPos = pos - 1;
                var idEnd = pos - 1;
                // 空白文字、｛｝以外が続く限りidentifierに1文字ずつ追加していく
                while (pos < length &&
                    !this.skipChar.has(ch) &&
                    ch != "{" &&
                    ch != "}" &&
                    ch != ",") {
                    identifier += ch;
                    ch = rawCode[pos];
                    pos++;
                    idEnd++;
                }
                pos--;
                if (!this.keywordMap.has(identifier)) {
                    tokenArr.push(new Token(TokenKind.IDENTIFIER, identifier, idPos, idEnd - 1));
                }
                else {
                    tokenArr.push(new Token(this.keywordMap.get(identifier), identifier, idPos, idEnd - 1));
                }
            }
        }
        tokenArr.push(new Token(TokenKind.END_PROGRAM, "", pos, pos));
        var tokens = [];
        for (var i = 0; i < tokenArr.length; i++) {
            if (this.langKeyword.has((_a = tokenArr[i]) === null || _a === void 0 ? void 0 : _a.kind)) {
                tokens.push(tokenArr[i]);
                i++;
                if (((_b = tokenArr[i]) === null || _b === void 0 ? void 0 : _b.kind) != TokenKind.LEFT_BRACE) {
                    throw new Error("syntax error");
                }
                tokens.push(tokenArr[i]);
                i++;
                var token = tokenArr[i];
                var braceCnt = 1;
                var rawPos = token.pos;
                var rawEnd = token.end;
                while (braceCnt != 0) {
                    if (i >= tokenArr.length) {
                        throw new Error("syntax error");
                    }
                    if (((_c = tokenArr[i]) === null || _c === void 0 ? void 0 : _c.kind) == TokenKind.LEFT_BRACE) {
                        braceCnt++;
                    }
                    else if (((_d = tokenArr[i]) === null || _d === void 0 ? void 0 : _d.kind) == TokenKind.RIGHT_BRACE) {
                        braceCnt--;
                    }
                    i++;
                }
                i--;
                rawEnd = (_e = tokenArr[i - 1]) === null || _e === void 0 ? void 0 : _e.end;
                tokens.push(new Token(TokenKind.IDENTIFIER, rawCode.slice(rawPos, rawEnd + 1), rawPos, rawEnd));
                tokens.push(tokenArr[i]);
            }
            else if (((_f = tokenArr[i]) === null || _f === void 0 ? void 0 : _f.kind) == TokenKind.TEST_CASE ||
                ((_g = tokenArr[i]) === null || _g === void 0 ? void 0 : _g.kind) == TokenKind.SKIPPED_TEST_CASE) {
                tokens.push(tokenArr[i]);
                var token = tokenArr[i];
                var namePos = token.pos;
                var nameEnd = token.end;
                i++;
                var name_1 = "";
                while (((_h = tokenArr[i]) === null || _h === void 0 ? void 0 : _h.kind) != TokenKind.LEFT_BRACE) {
                    console.log("a");
                    if (i >= tokenArr.length) {
                        throw new Error("syntax error");
                    }
                    name_1 += "".concat((_j = tokenArr[i]) === null || _j === void 0 ? void 0 : _j.text, " ");
                    nameEnd = (_k = tokenArr[i]) === null || _k === void 0 ? void 0 : _k.end;
                    i++;
                }
                if (name_1 != "") {
                    tokens.push(new Token(TokenKind.IDENTIFIER, name_1, namePos, nameEnd));
                }
                tokens.push(tokenArr[i]);
            }
            else {
                tokens.push(tokenArr[i]);
            }
        }
        // console.log(tokens);
        // ここから、tokensをirに変換します！頑張れ！
        this.parse(tokens, "a");
        // try{
        //     blocks = this.parse(tokenArr)
        // } catch (e) {
        //     //いったん上になげとく
        //     throw e;
        // }
        // console.log(blocks)
        //let ir = this.toIR(blocks)
    };
    Compiler.prototype.parse = function (tokens, name) {
        var resIR = {
            type: "file",
            name: name,
            statements: []
        };
        var blankFixtureObject = {
            name: "",
            statements: []
        };
        resIR.statements.push({
            type: "fixture",
            beforeAll: blankFixtureObject,
            beforeEach: blankFixtureObject,
            afterAll: blankFixtureObject,
            afterEach: blankFixtureObject
        });
        var pos = 0;
        var length = tokens.length;
        var addPos = function () {
            pos++;
            if (pos < length) {
                return true;
            }
            else {
                throw new Error("syntax error");
                return false;
            }
        };
        var makeObject = function () {
            var res = {};
            var token = tokens[pos];
            addPos();
            switch (token.kind) {
                case TokenKind.TEST_CASE:
                    console.log("testcase");
                    token = tokens[pos];
                    addPos();
                    var obj = {
                        type: "testCase",
                        name: token.text,
                        statements: []
                    };
                    token = tokens[pos];
                    addPos();
                    while (token.kind != TokenKind.RIGHT_BRACE) {
                        obj.statements.push(makeObject());
                        token = tokens[pos];
                        addPos();
                    }
                    res = obj;
                    console.log(res);
                default:
                    while (token.kind != TokenKind.RIGHT_BRACE) {
                        token = tokens[pos];
                        addPos();
                    }
                    console.log("その他");
            }
            return res;
        };
        while (pos < length) {
            resIR.statements.push(makeObject());
        }
        console.log(resIR);
        return resIR;
    };
    return Compiler;
}());
var TokenKind;
(function (TokenKind) {
    TokenKind[TokenKind["IDENTIFIER"] = 0] = "IDENTIFIER";
    TokenKind[TokenKind["LITERAL"] = 1] = "LITERAL";
    TokenKind[TokenKind["END_PROGRAM"] = 2] = "END_PROGRAM";
    TokenKind[TokenKind["LEFT_BRACE"] = 3] = "LEFT_BRACE";
    TokenKind[TokenKind["RIGHT_BRACE"] = 4] = "RIGHT_BRACE";
    TokenKind[TokenKind["COMMA"] = 5] = "COMMA";
    TokenKind[TokenKind["JS"] = 6] = "JS";
    TokenKind[TokenKind["PYTHON"] = 7] = "PYTHON";
    TokenKind[TokenKind["JAVA"] = 8] = "JAVA";
    TokenKind[TokenKind["AFTERALL"] = 9] = "AFTERALL";
    TokenKind[TokenKind["AFTEREACH"] = 10] = "AFTEREACH";
    TokenKind[TokenKind["BEFOREALL"] = 11] = "BEFOREALL";
    TokenKind[TokenKind["BEFOREEACH"] = 12] = "BEFOREEACH";
    TokenKind[TokenKind["TEST_CASE"] = 13] = "TEST_CASE";
    TokenKind[TokenKind["SKIPPED_TEST_CASE"] = 14] = "SKIPPED_TEST_CASE";
    TokenKind[TokenKind["ASSERT_EQUAL"] = 15] = "ASSERT_EQUAL";
    TokenKind[TokenKind["ASSERT_SAME"] = 16] = "ASSERT_SAME";
    TokenKind[TokenKind["ASSERT_TRUE"] = 17] = "ASSERT_TRUE";
    TokenKind[TokenKind["ASSERT_FALSE"] = 18] = "ASSERT_FALSE";
    TokenKind[TokenKind["ASSERT_NULL"] = 19] = "ASSERT_NULL";
    TokenKind[TokenKind["ASSERT_THROW"] = 20] = "ASSERT_THROW";
})(TokenKind || (TokenKind = {}));
var Token = /** @class */ (function () {
    function Token(kind, text, pos, end) {
        this.kind = kind;
        this.text = text;
        this.pos = pos;
        this.end = end;
    }
    return Token;
}());
var Block = /** @class */ (function () {
    function Block(token, children) {
        this.token = token;
        this.children = children;
    }
    return Block;
}());
var test = new Compiler();
test.compile("JS{a{gg{}}} JS {const globalDatabase = makeGlobalDatabase();}\n\nAfterAll {\n  JS {globalDatabase.cleanUp();}\n}\n\nTest simple test {\n  JS {const results = globalDatabase.findAll()}\n  equal{JS {results.length}, 0}\n}");
