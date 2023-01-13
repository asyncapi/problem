import { serializeMixinOptions, serializeType, getDeepProperty } from '../src/utils';

describe('utils', () => {
  describe('serializeMixinOptions', () => {
    test('should serialize mixin options', () => {
      const options1 = serializeMixinOptions({});
      const options2 = serializeMixinOptions({ typePrefix: 'https://example.com/test' });
      const options3 = serializeMixinOptions({ typePrefix: 'https://example.com/test/' });

      expect(options1?.typePrefix).toEqual(undefined);
      expect(options2?.typePrefix).toEqual('https://example.com/test');
      expect(options3?.typePrefix).toEqual('https://example.com/test');
    });
  });

  describe('serializeType', () => {
    test('should serialize problem type', () => {
      const type1 = serializeType('type');
      const type2 = serializeType('type', { typePrefix: 'https://example.com/test' });
      const type3 = serializeType('/type', { typePrefix: 'https://example.com/test' });
      const type4 = serializeType('https://example.com/test/type', { typePrefix: 'https://example.com/test/' });

      expect(type1).toEqual('type');
      expect(type2).toEqual('https://example.com/test/type');
      expect(type3).toEqual('https://example.com/test/type');
      expect(type4).toEqual('https://example.com/test/type');
    });
  });

  describe('getDeepProperty', () => {
    test('should retrieve deep property', () => {
      const value1 = getDeepProperty('property', { property: 'value' });
      const value2 = getDeepProperty('deep.deeper.value', { deep: { deeper: { value: 'deep-value' } } });
      const value3 = getDeepProperty('deep.deeper.value.non-existing', { deep: { deeper: { value: 'deep-value' } } });

      expect(value1).toEqual('value');
      expect(value2).toEqual('deep-value');
      expect(value3).toEqual(undefined);
    });
  });
});
