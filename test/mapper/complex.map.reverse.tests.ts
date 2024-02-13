import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { AnimalObject, MappedAnimalObject } from '../_models/animal.models';
import { complexMapping } from '../_models/example.mapping';

describe('Complex mapper', () => {
  const complexMapper = new StrictTypeMapper<AnimalObject, MappedAnimalObject, false>(complexMapping);

  it('should map input', () => {
    const input = complexMapper.mapReverse({
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

    expect(Object.keys(input).length).toBe(8);
    expect(input.name).toEqual('Jack');
    expect(input.name2).toEqual('Great');
    expect(input.age).toBe(20);
    expect(input.friendIDs).toBeUndefined();
    expect(input.friendIDsNullable).toEqual([1, 2, 3]);
    expect(input.friends[0]).toEqual({ age: 9 });
    expect(input.friendsNullable![0]).toEqual({ age: 9 });
    expect(input.features.color).toEqual('blond');
    expect(input.features.level).toEqual(97);
    expect(input.features.additional?.serialNumber).toEqual('s-03');
    expect(input.featuresNullable!.additional?.serialNumber).toEqual('s-03');
  });

  it('should map and reverse', () => {
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

    const input = complexMapper.map(output);
    const reversedObject = complexMapper.mapReverse(input);

    expect(reversedObject.name3).toBeUndefined(); //not mapped
    expect(reversedObject.friendIDs).toBeUndefined(); //not mapped
    expect(reversedObject.friends[0]).toEqual({ age: 10 });

    expect(output.name).toEqual(reversedObject.name);
    expect(output.name2).toEqual(reversedObject.name2);
    expect(output.age).toEqual(reversedObject.age);
    expect(output.friendIDsNullable).toEqual(reversedObject.friendIDsNullable);
    expect(output.features.color).toEqual(reversedObject.features.color);
    expect(output.features.level).toEqual(reversedObject.features.level);
    expect(output.features.additional?.serialNumber).toEqual(reversedObject.features.additional?.serialNumber);
  });
});
