import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { AnimalObject, MappedAnimalObject } from '../_models/animal.models';
import { complexMapping } from '../_models/example.mapping';

describe('Complex mapper', () => {
  const complexMapper = new StrictTypeMapper<AnimalObject, MappedAnimalObject, false>(complexMapping);

  it('should map reverse', () => {
    const output: AnimalObject = {
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

    const input = complexMapper.mapReverse(output);

    expect(input.name).toEqual('Jack');
    expect(input.name2).toEqual('Dawson');
    expect(input.age).toBe(20);
    expect(input.friendIDs).toBeUndefined();
    expect(input.friendIDsNullable).toEqual([1, 2, 3]);
    expect(input.friends[0].age).toEqual(10);
    expect(input.features.color).toEqual('blond');
    expect(input.features.level).toEqual(100);
    expect(input.features.additional?.serialNumber).toEqual('s-03');
  });

  it('should map and reverse', () => {
    const object: AnimalObject = {
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

    const entity = complexMapper.map(object);
    const reversedObject = complexMapper.mapReverse(entity);

    expect(reversedObject.name3).toBeUndefined(); //not mapped
    expect(reversedObject.friendIDs).toBeUndefined(); //not mapped
    expect(reversedObject.friends[0]).toEqual({ age: 10 });
    expect(object.name).toEqual(reversedObject.name);
    expect(object.name2).toEqual(reversedObject.name2);
    expect(object.age).toEqual(reversedObject.age);
    expect(object.friendIDsNullable).toEqual(reversedObject.friendIDsNullable);
    expect(object.features.color).toEqual(reversedObject.features.color);
    expect(object.features.level).toEqual(reversedObject.features.level);
    expect(object.features.additional?.serialNumber).toEqual(reversedObject.features.additional?.serialNumber);
  });
});
