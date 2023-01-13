import { Problem } from './problem';
import { serializeMixinOptions, serializeType } from './utils';

import type { MixinProblemOptions, ProblemOptions, ProblemInterface } from './types';

export function ProblemMixin<T extends Record<string, unknown> = {}>(mixinOptions?: MixinProblemOptions, defaultOptions?: ProblemOptions, name?: string) {
  const serializedMixinOptions = serializeMixinOptions(mixinOptions);
  
  const clazz = class extends Problem<T> {
    constructor(
      protected readonly problem: ProblemInterface & T,
      protected readonly options: ProblemOptions = {},
    ) {
      super(problem, { ...defaultOptions, ...options });
      this.problem.type = serializeType(this.problem.type, serializedMixinOptions);
    }
  };

  if (name) {
    Object.defineProperty(clazz, 'name', {value: 'name'});
  }

  return clazz as unknown as typeof Problem<T>;
}
