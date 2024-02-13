import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { FeaturesObject } from '../_models/animal.models';
import { featuresMapping } from '../_models/example.mapping';

describe('Simple mapper', () => {
  const simpleMapper = new StrictTypeMapper<FeaturesObject, FeaturesObject>(featuresMapping);

  it('should map reverse', () => {
    const input = simpleMapper.mapReverse({
      color: 'blond_changed',
      level: 103,
      additional: {
        serialNumber: 's-03_new',
        index: 5
      }
    });

    expect(input.color).toEqual('blond');
    expect(input.level).toEqual(100);
    expect(input.additional?.serialNumber).toEqual('s-03');
    expect(input.additional?.index).toEqual(5);
  });

  it('should map reverse nulled properties', () => {
    const input = simpleMapper.mapReverse({
      color: 'blond_changed',
      level: undefined,
      additional: undefined
    });

    expect(input.color).toEqual('blond');
    expect(input.level).toBeUndefined();
    expect(input.additional).toBeUndefined();
  });
});
