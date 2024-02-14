import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { AnimalObject, FeaturesObject, MappedAnimalObject } from '../_models/animal.models';
import { complexMapping, featuresMapping } from '../_models/example.mapping';
import { Features, Friend } from '../_models/non-nullable.model';

describe('Complex mapper', () => {
  const simpleMapper = new StrictTypeMapper<FeaturesObject, FeaturesObject>(featuresMapping);

  const complexMapper = new StrictTypeMapper<AnimalObject, MappedAnimalObject>(complexMapping);

  it('should map features', () => {
    const target = simpleMapper.map({
      color: 'blond',
      level: 100,
      additional: {
        serialNumber: 's-03',
        index: 5
      }
    });

    expect(target.color).toEqual('blond_changed');
    expect(target.level).toEqual(103);
    expect(target.additional?.serialNumber).toEqual('s-03_new');
    expect(target.additional?.index).toEqual(5);
  });

  it('should map input with nulled properties', () => {
    const target = simpleMapper.map({
      color: 'blond',
      additional: undefined
    });

    expect(target.color).toEqual('blond_changed');
    expect(target.level).toBeUndefined();
    expect(target.additional).toBeUndefined();
  });

  it('should map animal', () => {
    const input: AnimalObject = {
      name: 'Jack',
      name2: 'Dawson',
      name3: 'Great',
      age: 20,
      friendIDs: [1, 2, 3],
      friendIDsNullable: [1, 2, 3],
      friends: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond',
        level: 100,
        additional: {
          serialNumber: 's-03'
        }
      }
    };

    const target = complexMapper.map(input);

    expect(target.name2).toEqual('Jack');
    expect(target.name3).toEqual('Dawson');
    expect(target.name).toEqual('Great');
    expect(target.age).toBe(21);
    expect(target.friendIDs).toStrictEqual([1, 2, 3]);
    expect(target.friendIDsNullable).toStrictEqual([-1, -2, -3]);
    expect(target.friends[0].age).toEqual(11);
    expect(target.features.color).toEqual('blond_changed');
    expect(target.features.level).toEqual(103);
    expect(target.features.additional?.serialNumber).toEqual('s-03_new');
  });

  it('should map animal with nulled properties', () => {
    const target = complexMapper.map({
      name: 'Dawson',
      nameNullable: null as unknown as string,
      name2: 'Jack',
      name3: 'Great',
      age: 21,
      ageNullable: null,
      friendIDs: [1, 2, 3],
      friendIDsNullable: null as unknown as number[],
      friends: [{ name: 'Rose', age: 10 }],
      friendsNullable: null as unknown as Friend[],
      features: null as unknown as Features,
      featuresNullable: null as unknown as Features
    });

    expect(target.nameNullable).toBe('default');
    expect(target.age_nullable).toBe(0);
    expect(target.friendIDsNullable).toBeNull();
    expect(target.friends_nullable).toBeNull();
    expect(target.features).toBeNull();
    expect(target.features_nullable).toBeNull();
  });

  it('should return input keys', () => {
    const sourceKeys = complexMapper.getCompiledMapping().sourceKeys;

    expect(sourceKeys).toContain('nameNullable');
    expect(sourceKeys).toContain('name2');
    expect(sourceKeys).toContain('name3');
    expect(sourceKeys).toContain('age');
    expect(sourceKeys).toContain('age_nullable');
    expect(sourceKeys).toContain('friendIDsNullable');
    expect(sourceKeys).toContain('friends');
    expect(sourceKeys).toContain('friends_nullable');
    expect(sourceKeys).toContain('features');
    expect(sourceKeys).toContain('features_nullable');
  });
});
