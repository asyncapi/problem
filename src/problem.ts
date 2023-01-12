import { serializeType, getDeepProperty } from "./utils";

import type {
  ProblemInterface,
  ProblemOptions,
  CopyProblemOptions,
  ToObjectProblemOptions,
  StringifyProblemOptions,
  UpdateProblemOptions,
  Constructable,
  Path,
  PathValue
} from "./types";

const defaultToObjectOptions: ToObjectProblemOptions = {
  includeStack: false, 
  includeCause: false,
}

const defaultStringifyOptions: StringifyProblemOptions = {
  includeStack: false, 
  includeCause: false,
}

export class Problem<T extends Record<string, any> = Record<string, any>> extends Error {
  static parse(problem: string, reviver?: (this: any, key: string, value: any) => any, options?: ProblemOptions) {
    const parsedProblem = JSON.parse(problem, reviver);
    return new this(parsedProblem, options);
  }

  static throw(problem: ProblemInterface): never {
    throw new Problem(problem);
  }

  constructor(
    protected readonly problem: ProblemInterface & T,
    protected readonly options: ProblemOptions = {},
  ) {
    super(problem.detail || problem.title);
    
    this.problem.type = serializeType(this.problem.type);
    this.cause = problem.cause || this.cause;
    this.stack = problem.stack || this.stack;
  }

  get(): ProblemInterface & T;
  get<R = ProblemInterface & T, P extends Path<R> = any, PV = PathValue<R, P>>(path: P): PV;
  get<R = ProblemInterface & T, P extends Path<R> = any, PV = PathValue<R, P>>(path?: P): PV | (ProblemInterface & T) {
    if (typeof path !== 'string') {
      return this.problem as ProblemInterface & T;
    }
    return getDeepProperty(this.problem, path) as PV;
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
      };
      case 'skipProps': {
        Object.keys(this.problem).forEach(property => {
          if (!properties?.includes(property)) {
            newProblem[property as string] = this.problem[property];
          }
        });
      }
    }

    return new clazz(newProblem, { ...this.options });
  }

  toObject(options: ToObjectProblemOptions = defaultToObjectOptions): ProblemInterface & T {
    const problem = { ...this.problem };

    if (!options.includeStack) {
      delete problem.stack;
    }
    if (!options.includeCause) {
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

  update({ updates }: UpdateProblemOptions<ProblemInterface & T>) {
    Object.keys(updates).forEach(key => {
      this.problem[key as keyof ProblemInterface & T] = updates[key as keyof ProblemInterface & T];
    });
  }
}
