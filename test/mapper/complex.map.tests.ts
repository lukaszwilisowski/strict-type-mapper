import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { AnimalObject, MappedAnimalObject } from '../_models/animal.models';
import { complexMapping } from '../_models/example.mapping';
import { Features, Friend } from '../_models/non-nullable.model';

describe('Complex mapper', () => {
  const complexMapper = new StrictTypeMapper<AnimalObject, MappedAnimalObject, false>(complexMapping);

  it('should map input', () => {
    const output = complexMapper.map({
      name: 'Dawson',
      name2: 'Jack',
      name3: 'Great',
      age: 21,
      friendIDs: [1, 2, 3],
      friendIDsNullable: [-1, -2, -3],
      friends: [{ name: 'Rose', age: 10 }],
      friendsNullable: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond_changed',
        level: 100,
        additional: {
          serialNumber: 's-03_new'
        }
      },
      featuresNullable: {
        color: 'blond_changed',
        level: 100,
        additional: {
          serialNumber: 's-03_new'
        }
      }
    });

    expect(Object.keys(output).length).toBe(8);
    expect(output.name).toEqual('Jack');
    expect(output.name2).toEqual('Great');
    expect(output.age).toBe(20);
    expect(output.friendIDs).toBeUndefined();
    expect(output.friendIDsNullable).toEqual([1, 2, 3]);
    expect(output.friends[0]).toEqual({ age: 9 });
    expect(output.friends_nullable![0]).toEqual({ age: 9 });
    expect(output.features.color).toEqual('blond');
    expect(output.features.level).toEqual(97);
    expect(output.features.additional?.serialNumber).toEqual('s-03');
    expect(output.features_nullable!.additional?.serialNumber).toEqual('s-03');
  });

  it('should map input with nulled properties (SQL)', () => {
    const output = complexMapper.map({
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

    expect(output.nameNullable).toBe('default');
    expect(output.age_nullable).toBe(0);
    expect(output.friendIDsNullable).toBeNull();
    expect(output.friends_nullable).toBeNull();
    expect(output.features).toBeNull();
    expect(output.features_nullable).toBeNull();
  });

  it('should return input keys', () => {
    const inputKeys = complexMapper.getCompiledMapping().inputKeys;

    expect(inputKeys).not.toContain('name');
    expect(inputKeys).toContain('nameNullable');
    expect(inputKeys).toContain('name2');
    expect(inputKeys).toContain('name3');
    expect(inputKeys).toContain('age');
    expect(inputKeys).toContain('age_nullable');
    expect(inputKeys).not.toContain('friendIDs');
    expect(inputKeys).toContain('friendIDsNullable');
    expect(inputKeys).toContain('friends');
    expect(inputKeys).toContain('friends_nullable');
    expect(inputKeys).toContain('features');
    expect(inputKeys).toContain('features_nullable');
  });
});
