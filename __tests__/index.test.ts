import { COPY_MODE, Problem } from "../src";
import ProblemContextHelper from "./_helper";

const _testContext = new ProblemContextHelper();

test("create problem with custom keys", () => {
  const customKey = "RCA";
  const testProblem = new Problem(_testContext._problemInstance, ["RCA"]);
  expect(testProblem).toHaveProperty(customKey);
});

test('copy problem with mode="LEAVE PROPS"', () => {
  const _problemCopy = _testContext._problemInstance.copy(
    _testContext._problemInstance,
    COPY_MODE.LEAVE_PROPS,
    []
  );
  expect(_problemCopy).toBeInstanceOf(Problem);
  expect(_problemCopy.type).toBe(_testContext._problemInstance.type);
  expect(_problemCopy.title).toBe(_testContext._problemInstance.title);
});

test('copy problem with mode="SKIP PROPS"', () => {
  const _copiedProblem = _testContext._problemInstance.copy(
    _testContext._problemInstance,
    COPY_MODE.SKIP_PROPS,
    ["details"]
  );
  expect(_copiedProblem.details).toBeUndefined();
});
