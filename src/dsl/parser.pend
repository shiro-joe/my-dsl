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
  RawLangObject,} from "./ir.ts"

export class Parser{
    rawData: string = "";
    irData: FileObject;
    public constructor(name: string){
        this.irData = {type: "file", name: name, statements: []}
    }
    public parseDSL(dsl: string) {
        this.rawData = dsl;

    }
    private readRawLang(lang: string) {
        let content;
        this.irData.({type: "rawLang", lang: lang, content: content})
    }
  private readonly keyMap = {
    JS: this.readRawLang("JS"),
    Python: this.readRawLang("Python"),
    Java: this.readRawLang("Java"),
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
}