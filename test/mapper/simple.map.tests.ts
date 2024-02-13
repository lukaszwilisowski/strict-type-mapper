import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { FeaturesObject } from '../_models/animal.models';
import { featuresMapping } from '../_models/example.mapping';

describe('Simple mapper', () => {
  const simpleMapper = new StrictTypeMapper<FeaturesObject, FeaturesObject>(featuresMapping);

  it('should map input', () => {
    const output = simpleMapper.map({
      color: 'blond_changed',
      level: 100,
      additional: {
        serialNumber: 's-03_new',
        index: 5
      }
    });

    expect(output.color).toEqual('blond_changed');
    expect(output.level).toEqual(103);
    expect(output.additional?.serialNumber).toEqual('s-03_new');
    expect(output.additional?.index).toEqual(5);
  });

  it('should map input with nulled properties (SQL)', () => {
    const output = simpleMapper.map({
      color: 'blond_changed',
      level: 100,
      additional: undefined
    });

    expect(output.color).toEqual('blond_changed');
    expect(output.level).toEqual(100);
    expect(output.additional).toBeUndefined();
  });
});
