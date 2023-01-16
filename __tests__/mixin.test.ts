import { ProblemMixin } from '../src';

describe('ProblemMixin', () => {
  test('should create new class definition from mixin (saved as reference)', () => {
    const Problem = ProblemMixin();
    expect(new Problem({ type: '', title: '' })).toBeInstanceOf(Problem);
  });

  test('should create new class definition from mixin (used in class)', () => {
    class Problem extends ProblemMixin() {}
    expect(new Problem({ type: '', title: '' })).toBeInstanceOf(Problem);
  });

  test('should see type passed as generic', () => {
    class Problem extends ProblemMixin<{ test: string }>() {}
    const instance = new Problem({ type: '', title: '', test: 'test-value' });
    expect(instance).toBeInstanceOf(Problem);
    expect(instance.get('test')).toEqual('test-value');
  });

  test('should use typePrefix option', () => {
    class Problem extends ProblemMixin({ typePrefix: 'https://example.com/test' }) {}
    const instance = new Problem({ type: 'test-type', title: '' });
    expect(instance).toBeInstanceOf(Problem);
    expect(instance.get('type')).toEqual('https://example.com/test/test-type');
  });

  test('should use typePrefix option (with \'/\' in the suffix)', () => {
    class Problem extends ProblemMixin({ typePrefix: 'https://example.com/test/' }) {}
    const instance = new Problem({ type: 'test-type', title: '' });
    expect(instance).toBeInstanceOf(Problem);
    expect(instance.get('type')).toEqual('https://example.com/test/test-type');
  });

  describe('should use class name passed in arguments', () => {
    const Problem = ProblemMixin(undefined, undefined, 'ExtendedProblem');
    expect(Problem.name).toEqual('ExtendedProblem');
  });

  describe('should use name of defined class ()', () => {
    class SomeProblem extends ProblemMixin(undefined, undefined, 'ExtendedProblem') {}
    expect(SomeProblem.name).toEqual('SomeProblem');
  });

  describe('static createType()', () => {
    test('should return proper type (with typePrefix)', () => {
      class Problem extends ProblemMixin({ typePrefix: 'https://example.com/test' }) {}
      const type = Problem.createType('type');
      expect(type).toEqual('https://example.com/test/type');
    });

    test('should return proper type (without typePrefix options)', () => {
      class Problem extends ProblemMixin({}) {}
      const type = Problem.createType('type');
      expect(type).toEqual('type');
    });
  });
});
