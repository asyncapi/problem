import { Problem } from '../src';

describe('Problem', () => {
  test('should create new instance', () => {
    expect(new Problem({ type: '', title: '' })).toBeInstanceOf(Problem);
  });

  describe('get()', () => {
    test('should retrieve proper property (default one)', () => {
      const problem = new Problem({ type: 'test-type', title: '' });
      expect(problem.get('type')).toEqual('test-type');
    });

    test('should retrieve deep property', () => {
      const problem = new Problem<{ deep: { deeper: { property: string } } }>({ type: '', title: '', deep: { deeper: { property: 'deep-value' } } });
      expect(problem.get('deep.deeper.property')).toEqual('deep-value');
    });
  });

  describe('set()', () => {
    test('should update problem shape', () => {
      const problem = new Problem({ type: 'test-type', title: 'Some title', detail: 'Some details' });
      problem.set({ title: 'New title', detail: 'New details' });
      expect(problem.get()).toEqual({ type: 'test-type', title: 'New title', detail: 'New details' });
    });

    test('should update problem shape by key', () => {
      const problem = new Problem({ type: 'test-type', title: 'Some title', detail: 'Some details' });
      problem.set('title', 'New title');
      expect(problem.get()).toEqual({ type: 'test-type', title: 'New title', detail: 'Some details' });
    });
  });

  describe('copy()', () => {
    const problemObject = { type: 'test-type', title: 'Some title', detail: 'Some detail', instance: 'Some instance', stack: 'stack', cause: 'cause' };
    const problem = new Problem(problemObject);

    test('should whole copy object', () => {
      const newProblem = problem.copy();
      expect(newProblem.get()).toEqual(problemObject);
    });

    test('should leave given properties (only type and title)', () => {
      const newProblem = problem.copy({ mode: 'leaveProps', properties: [] });
      expect(newProblem.get()).toEqual({ type: 'test-type', title: 'Some title' });
    });

    test('should leave given properties', () => {
      const newProblem = problem.copy({ mode: 'leaveProps', properties: ['detail', 'stack'] });
      expect(newProblem.get()).toEqual({ type: 'test-type', title: 'Some title', detail: 'Some detail', stack: 'stack' });
    });

    test('should skip given properties (leave all properties)', () => {
      const newProblem = problem.copy({ mode: 'skipProps', properties: [] });
      expect(newProblem.get()).toEqual(problemObject);
    });

    test('should skip given properties', () => {
      const newProblem = problem.copy({ mode: 'skipProps', properties: ['detail', 'stack'] });
      expect(newProblem.get()).toEqual({ type: 'test-type', title: 'Some title', instance: 'Some instance', cause: 'cause' });
    });

    test('should skip given properties (always leave title and type)', () => {
      const newProblem = problem.copy({ mode: 'skipProps', properties: ['type', 'title'] as any });
      expect(newProblem.get()).toEqual(problemObject);
    });
  });

  describe('toObject()', () => {
    const problemObject = { type: 'test-type', title: 'Some title', stack: 'stack', cause: 'cause' };
    const problem = new Problem(problemObject);

    test('should return problem shape', () => {
      expect(problem.toObject()).toEqual({ type: 'test-type', title: 'Some title' });
    });

    test('should return problem shape (with stack)', () => {
      expect(problem.toObject({ includeStack: true })).toEqual({ type: 'test-type', title: 'Some title', stack: 'stack' });
    });

    test('should return problem shape (with cause)', () => {
      expect(problem.toObject({ includeCause: true })).toEqual({ type: 'test-type', title: 'Some title', cause: 'cause' });
    });

    test('should return problem shape (with stack and cause)', () => {
      expect(problem.toObject({ includeStack: true, includeCause: true })).toEqual(problemObject);
    });
  });

  describe('stringify()', () => {
    const problemObject = { type: 'test-type', title: 'Some title', stack: 'stack', cause: 'cause' };
    const problem = new Problem(problemObject);

    test('should return stringified problem shape', () => {
      expect(problem.stringify()).toEqual(JSON.stringify({ ...problemObject, stack: undefined, cause: undefined }));
    });

    test('should return stringified problem shape (with stack)', () => {
      expect(problem.stringify({ includeStack: true })).toEqual(JSON.stringify({ ...problemObject, cause: undefined }));
    });

    test('should return stringified problem shape (with cause)', () => {
      expect(problem.stringify({ includeCause: true })).toEqual(JSON.stringify({ ...problemObject, stack: undefined }));
    });

    test('should return stringified problem shape (with stack and cause)', () => {
      expect(problem.stringify({ includeStack: true, includeCause: true })).toEqual(JSON.stringify(problemObject));
    });
  });

  describe('isOfType()', () => {
    test('should return true if type is equal', () => {
      const problem = new Problem({ type: 'test-type', title: '' });
      expect(problem.isOfType('test-type')).toEqual(true);
    });

    test('should return false if type is not equal', () => {
      const problem = new Problem({ type: 'test-type', title: '' });
      expect(problem.isOfType('unknown')).toEqual(false);
    });
  });

  describe('static createType()', () => {
    test('should return this same type', () => {
      const type = Problem.createType('type');
      expect(type).toEqual('type');
    });
  });
});
