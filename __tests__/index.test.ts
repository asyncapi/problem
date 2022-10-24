import { Problem } from "../src";
import { COPY_MODE } from "../src/constants";
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
      COPY_MODE.LEAVE_PROPS,
      ["leaveThisWhenCopy"]
    );
    expect(_problemCopy).toBeInstanceOf(Problem);
    expect(_problemCopy.type).toBe(_testContext._problemInstance.type);
    expect(_problemCopy.title).toBe(_testContext._problemInstance.title);
    expect(_problemCopy.leaveThisWhenCopy).toBe(_testContext._problemInstance.leaveThisWhenCopy);
    expect(_problemCopy.skipThisWhenCopy).toBe(undefined);
  });

  test("Method: Copy, mode: SKIP_PROPS", () => {
    const _copiedProblem = _testContext._problemInstance.copy(
      COPY_MODE.SKIP_PROPS,
      ["skipThisWhenCopy"]
    );
    expect(_copiedProblem).toBeInstanceOf(Problem);
    expect(_copiedProblem.skipThisWhenCopy).toBeUndefined();
    expect(_copiedProblem.leaveThisWhenCopy).toBe(_testContext._problemInstance.leaveThisWhenCopy);
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
