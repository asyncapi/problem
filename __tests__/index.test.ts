import { COPY_MODE, Problem } from "../src";
import ProblemContextHelper from "./_helper";

const _testContext = new ProblemContextHelper();

describe("Class Methods Test Suite", () => {
  test("Create Class with Custom Keys", () => {
    const customKey = "RCA";
    _testContext._problemInstance[customKey]="Root Cause Analysis"
    const testProblem = new Problem(_testContext._problemInstance);
    expect(testProblem).toHaveProperty(customKey);
  });

  test("Method: Copy, mode: LEAVE_PROPS", () => {
    const _problemCopy = _testContext._problemInstance.copy(
      _testContext._problemInstance,
      COPY_MODE.LEAVE_PROPS,
      []
    );
    expect(_problemCopy).toBeInstanceOf(Problem);
    expect(_problemCopy.type).toBe(_testContext._problemInstance.type);
    expect(_problemCopy.title).toBe(_testContext._problemInstance.title);
  });

  test("Method: Copy, mode: SKIP_PROPS", () => {
    const _copiedProblem = _testContext._problemInstance.copy(
      _testContext._problemInstance,
      COPY_MODE.SKIP_PROPS,
      ["details"]
    );
    expect(_copiedProblem.details).toBeUndefined();
  });

  test("Method: isOfType", () => {
    const _TYPE_TRUTH_CHECK = "null-or-falsey-document";
    const _TYPE_FALSE_CHECK = "undefined-document";
    expect(
      _testContext._problemInstance.isOfType(_TYPE_TRUTH_CHECK)
    ).toBeTruthy();
    expect(
      _testContext._problemInstance.isOfType(_TYPE_FALSE_CHECK)
    ).toBeFalsy();
  });

  test("Method: Update", async () => {
    const LINK: string = "test-link/";
    const updates = {
      link: LINK,
    };
    await _testContext._problemInstance.update({ updates });
    expect(_testContext._problemInstance).toHaveProperty("link", LINK);
  });

  test("Method: toJSON", () => {
    const _problem = _testContext._problemInstance;

    // Run updates first to add stack property, required for testing  isJSON
    const updates = {
      stack: "./filepath",
    };
    _problem.update({ updates });

    // non-stringified stack
    expect(_problem.toJSON({ includeStack: true })).toHaveProperty(
      "stack",
      updates.stack
    );
    expect(_problem.toJSON({ includeStack: false })).not.toHaveProperty(
      "stack"
    );
  });
});
