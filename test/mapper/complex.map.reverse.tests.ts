import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { AnimalObject, FeaturesObject, MappedAnimalObject } from '../_models/animal.models';
import { complexMapping, featuresMapping } from '../_models/example.mapping';

describe('Complex mapper', () => {
  const simpleMapper = new StrictTypeMapper<FeaturesObject, FeaturesObject>(featuresMapping);

  const complexMapper = new StrictTypeMapper<AnimalObject, MappedAnimalObject>(complexMapping);

  it('should map reverse features', () => {
    const source = simpleMapper.mapReverse({
      color: 'blond_changed',
      level: 103,
      additional: {
        serialNumber: 's-03_new',
        index: 5
      }
    });

    expect(source.color).toEqual('blond');
    expect(source.level).toEqual(100);
    expect(source.additional?.serialNumber).toEqual('s-03');
    expect(source.additional?.index).toEqual(5);
  });

  it('should map reverse features with nulled properties', () => {
    const source = simpleMapper.mapReverse({
      color: 'blond_changed',
      level: undefined,
      additional: undefined
    });

    expect(source.color).toEqual('blond');
    expect(source.level).toBeUndefined();
    expect(source.additional).toBeUndefined();
  });

  it('should map reverse animal', () => {
    const source = complexMapper.mapReverse({
      name: 'Dawson',
      name2: 'Jack',
      name3: 'Great',
      age: 21,
      friendIDs: [1, 2, 3],
      friendIDsNullable: [-1, -2, -3],
      friends: [{ name: 'Rose', age: 10 }],
      friends_nullable: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond_changed',
        level: 100,
        additional: {
          serialNumber: 's-03_new'
        }
      },
      features_nullable: {
        color: 'blond_changed',
        level: 100,
        additional: {
          serialNumber: 's-03_new'
        }
      }
    });

    expect(source.name).toEqual('Jack');
    expect(source.name2).toEqual('Great');
    expect(source.age).toBe(20);
    expect(source.friendIDsNullable).toEqual([1, 2, 3]);
    expect(source.friends[0]).toEqual({ name: 'Rose', age: 9 });
    expect(source.friendsNullable![0]).toEqual({ name: 'Rose', age: 9 });
    expect(source.features.color).toEqual('blond');
    expect(source.features.level).toEqual(97);
    expect(source.features.additional?.serialNumber).toEqual('s-03');
    expect(source.featuresNullable!.additional?.serialNumber).toEqual('s-03');
  });

  it('should map animal and reverse', () => {
    const source: AnimalObject = {
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

    const target = complexMapper.map(source);
    const remappedSource = complexMapper.mapReverse(target);

    expect(remappedSource.friends[0]).toEqual({ name: 'Rose', age: 10 });

    expect(source.name).toEqual(remappedSource.name);
    expect(source.name2).toEqual(remappedSource.name2);
    expect(source.age).toEqual(remappedSource.age);
    expect(source.friendIDsNullable).toEqual(remappedSource.friendIDsNullable);
    expect(source.features.color).toEqual(remappedSource.features.color);
    expect(source.features.level).toEqual(remappedSource.features.level);
    expect(source.features.additional?.serialNumber).toEqual(remappedSource.features.additional?.serialNumber);
  });
});
