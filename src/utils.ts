import { MixinProblemOptions } from './types';

export function serializeMixinOptions(options?: MixinProblemOptions): MixinProblemOptions {
  if (!options) {
    return {};
  }

  options = { ...options };
  const typePrefix = options.typePrefix;
  if (typePrefix && typePrefix.endsWith('/')) {
    options.typePrefix = typePrefix.slice(0, -1);
  }
  return options;
}

export function serializeType(type: string, options?: MixinProblemOptions) {
  const typePrefix = options?.typePrefix;
  if (!typePrefix || type.startsWith(typePrefix)) {
    return type;
  }
  type = type.startsWith('/') ? type.slice(1) : type;
  return `${typePrefix}/${type}`;
}

const MINUS_INFINITY = -(1 / 0);
function toKey(value: any) {
  return (value === '0' && (1 / value) === MINUS_INFINITY) ? '-0' : value;
}

export function getDeepProperty(path: string | string[], value: object) {
  if (!Array.isArray(path)) {
    path = path.split('.').filter(Boolean);
  }

  let index = 0;
  const length = path.length;

  while (value !== null && index < length) {
    value = (value as any)[toKey(path[index++])];
  }
  return index === length ? value : undefined;
}
