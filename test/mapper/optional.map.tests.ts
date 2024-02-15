import { describe, expect, it } from '@jest/globals';
import { StrictTypeMapper } from 'strict.type.mapper';
import { AnimalObject, MappedAnimalObject } from '../_models/animal.models';
import { PartialAnimal, optionalMapping } from '../_models/example.mapping';

describe('Optional mapper', () => {
  const optionalMapper = new StrictTypeMapper<PartialAnimal, MappedAnimalObject, false>(optionalMapping);

  it('should map partial animal', () => {
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

    const target = optionalMapper.map(input);

    expect(target.name2).toEqual('Jack');
    expect(target.name3).toEqual('Dawson');
    expect(target.name).toEqual('Great');
    expect(target.age).toBe(21);
    expect(target.nameNullable).toBeUndefined();
    //
    expect(target.friendIDs).toBeUndefined();
    expect(target.friendIDsNullable).toBeUndefined();
    expect(target.friends).toBeUndefined();
    expect(target.features).toBeUndefined();
    expect(target.features).toBeUndefined();
    expect(target.features).toBeUndefined();
  });

  it('should map partial animal with nulled properties', () => {
    const target = optionalMapper.map({
      name: 'Jack',
      name2: 'Dawson',
      name3: 'Great',
      age: 20,
      nameNullable: undefined
    });

    expect(target.name2).toEqual('Jack');
    expect(target.name3).toEqual('Dawson');
    expect(target.name).toEqual('Great');
    expect(target.age).toBe(21);
    expect(target.nameNullable).toBeUndefined();
    //
    expect(target.age_nullable).toBeUndefined();
    expect(target.friendIDsNullable).toBeUndefined();
    expect(target.friends_nullable).toBeUndefined();
    expect(target.features).toBeUndefined();
    expect(target.features_nullable).toBeUndefined();
  });

  it('should return partial input keys', () => {
    const targetKeys = optionalMapper.getCompiledMapping().targetKeys;

    expect(targetKeys).toContain('name');
    expect(targetKeys).toContain('name2');
    expect(targetKeys).toContain('name3');
    expect(targetKeys).toContain('age');
    expect(targetKeys).toContain('nameNullable');
    expect(targetKeys).not.toContain('friendIDsNullable');
    expect(targetKeys).not.toContain('friends');
    expect(targetKeys).not.toContain('friends_nullable');
    expect(targetKeys).not.toContain('features');
    expect(targetKeys).not.toContain('features_nullable');
  });
});
