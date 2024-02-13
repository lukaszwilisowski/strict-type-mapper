import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { FeaturesObject } from '../_models/animal.models';
import { featuresMapping } from '../_models/example.mapping';

describe('Simple mapper', () => {
  const simpleMapper = new StrictTypeMapper<FeaturesObject, FeaturesObject>(featuresMapping);

  it('should map input', () => {
    const output = simpleMapper.map({
      color: 'blond',
      level: 100,
      additional: {
        serialNumber: 's-03',
        index: 5
      }
    });

    expect(output.color).toEqual('blond_changed');
    expect(output.level).toEqual(103);
    expect(output.additional?.serialNumber).toEqual('s-03_new');
    expect(output.additional?.index).toEqual(5);
  });

  it('should map input with nulled properties', () => {
    const output = simpleMapper.map({
      color: 'blond',
      additional: undefined
    });

    expect(output.color).toEqual('blond_changed');
    expect(output.level).toBeUndefined();
    expect(output.additional).toBeUndefined();
  });
});
