import { Problem } from './problem';
import { serializeMixinOptions, serializeType } from './utils';

import type { MixinProblemOptions, ProblemOptions, ProblemInterface, Constructable } from './types';

export function ProblemMixin<T extends Record<string, any> = Record<string, any>>(mixinOptions?: MixinProblemOptions, defaultOptions?: ProblemOptions, name?: string): Constructable<Problem<ProblemInterface & T>> {
  const serializedMixinOptions = serializeMixinOptions(mixinOptions);
  
  const clazz = class extends Problem<T> {
    static override throw(problem: ProblemInterface & T): never {
      throw new this(problem);
    }

    constructor(
      protected readonly problem: ProblemInterface & T,
      protected readonly options: ProblemOptions = {},
    ) {
      super(problem, { ...defaultOptions, ...options });
      this.problem.type = serializeType(this.problem.type, serializedMixinOptions);
    }
  }

  if (name) {
    Object.defineProperty (clazz, 'name', {value: 'name'});
  }

  return clazz;
}
