import { getDeepProperty } from './utils';

import type {
  ProblemInterface,
  ProblemOptions,
  CopyProblemOptions,
  ToObjectProblemOptions,
  StringifyProblemOptions,
  Constructable,
  Path,
  PathValue,
} from './types';

const defaultToObjectOptions: ToObjectProblemOptions = {
  includeStack: false, 
  includeCause: false,
};

const defaultStringifyOptions: StringifyProblemOptions = {
  includeStack: false, 
  includeCause: false,
};

export class Problem<T extends Record<string, unknown> = {}> extends Error {
  constructor(
    protected readonly problem: ProblemInterface & T,
    protected readonly options: ProblemOptions = {},
  ) {
    super(problem.detail || problem.title);
    this.cause = problem.cause || this.cause;
    this.stack = problem.stack || this.stack;
  }

  get(): ProblemInterface & T;
  get<P extends Path<ProblemInterface & T>, PV = PathValue<ProblemInterface & T, P>>(path: P): PV;
  get<P extends Path<ProblemInterface & T>, PV = PathValue<ProblemInterface & T, P>>(path?: P): PV | (ProblemInterface & T) {
    if (typeof path !== 'string') {
      return this.problem as ProblemInterface & T;
    }
    return getDeepProperty(path, this.problem) as PV;
  }

  set(problem: Partial<ProblemInterface & T>): ProblemInterface & T;
  set<K extends keyof (ProblemInterface & T)>(key: K, value: (ProblemInterface & T)[K]): (ProblemInterface & T)[K];
  set<K extends keyof (ProblemInterface & T)>(keyOrObject: K | Partial<ProblemInterface & T>, value?: (ProblemInterface & T)[K]): (ProblemInterface & T) | (ProblemInterface & T)[K] {
    if (typeof keyOrObject !== 'string') {
      return Object.assign(this.problem, keyOrObject);
    }
    return this.problem[keyOrObject] = value;
  }

  copy(options?: CopyProblemOptions<Array<keyof Omit<ProblemInterface & T, 'type' | 'title'>>>): Problem {
    const clazz = this.constructor as Constructable;
    if (!options) {
      return new clazz({ ...this.problem }, { ...this.options });
    }

    const newProblem: Record<string, any> = {
      type: this.problem.type,
      title: this.problem.title,
    };
    const { mode, properties } = options;

    switch (mode) {
    case 'leaveProps': {
      properties?.forEach(property => {
        newProblem[property as string] = this.problem[property];
      });
      break;
    }
    case 'skipProps': {
      Object.keys(this.problem).forEach(property => {
        if (!properties?.includes(property as unknown as keyof Omit<ProblemInterface & T, 'type' | 'title'>)) {
          newProblem[property as string] = this.problem[property];
        }
      });
    }
    }

    return new clazz(newProblem, { ...this.options });
  }

  toObject({ includeStack, includeCause }: ToObjectProblemOptions = defaultToObjectOptions): ProblemInterface & T {
    const problem = { ...this.problem };

    if (!includeStack) {
      delete problem.stack;
    }
    if (!includeCause) {
      delete problem.cause;
    }

    return problem;
  }

  stringify(options?: StringifyProblemOptions, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
  stringify(options?: StringifyProblemOptions, replacer?: (number | string)[] | null, space?: string | number): string;
  stringify(options: StringifyProblemOptions = defaultStringifyOptions, replacer?: ((this: any, key: string, value: any) => any) | ((number | string)[] | null), space?: string | number): string {
    return JSON.stringify(this.toObject(options), replacer as any, space);
  }

  isOfType(type: string) {
    return this.problem.type === type;
  }
}
