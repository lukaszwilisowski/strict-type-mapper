/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it } from '@jest/globals';
import { MapTo } from 'helpers/map.to.helper';
import { Mapping } from 'interfaces/mapping.interface';
import {
  AdditionalObject,
  AnimalObject,
  FeaturesObject,
  FriendObject,
  MappedAnimalObject
} from '../_models/animal.models';

describe('Mapping', () => {
  it('should work with two properties of the same type', () => {
    type A = { a: number };
    type B = { b: number };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should work with two nullable properties', () => {
    type A = { a: number | null };
    type B = { b: number | null };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should work with two optional properties', () => {
    type A = { a?: number };
    type B = { b?: number };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should work with two optional nullable properties', () => {
    type A = { a?: string | null };
    type B = { b?: string | null };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should work with different properties of the same type', () => {
    type A = { a: number };
    type B = { b: number };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should not work when mapping standard property to optional property', () => {
    type A = { a: number };
    type B = { b?: number };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should not work when mapping optional property to standard property', () => {
    type A = { a?: number };
    type B = { b: number };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should not work when mapping optional property to optional property', () => {
    type A = { a: number | null };
    type B = { b?: number };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should not work when mapping optional property to nullable property', () => {
    type A = { a?: number };
    type B = { b: number | null };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should work with transformed property', () => {
    type A = { a: string };
    type B = { b: number };

    const mapping: Mapping<A, B> = {
      a: MapTo.Property(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString().toLowerCase()
      )
    };
  });

  it('should work with optional transformed properties', () => {
    type A = { a?: string };
    type B = { b?: number };

    const mapping: Mapping<A, B> = {
      a: MapTo.Property(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString().toLowerCase()
      )
    };
  });

  it('should work with transformed property with selection', () => {
    type A = { a: string; a2: number };
    type B = { b: number; b2: string };

    const mapping: Mapping<A, B> = {
      a: MapTo.Property(
        'b2',
        (sourceB: string) => sourceB,
        (targetB: string) => targetB
      ),
      a2: MapTo.Property(
        'b',
        (sourceB: number) => sourceB,
        (targetB: number) => targetB
      )
    };
  });

  it('should not work when transforming non-optional property to optional property', () => {
    type A = { a: string; a2: string };
    type B = { b?: number; b2: number };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Property(
        'b',
        (a: string) => parseInt(a),
        (b: number) => b.toString()
      ),
      a2: MapTo.Property(
        'b2',
        (a2: string) => parseInt(a2),
        (b2: number) => b2.toString()
      )
    };
  });

  it('should not work when transforming optional property to non-optional property', () => {
    type A = { a?: string; a2: string };
    type B = { b: number; b2: number };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Property(
        'b',
        (a: string) => parseInt(a),
        (b: number) => b.toString()
      ),
      a2: MapTo.Property(
        'b2',
        (a2: string) => parseInt(a2),
        (b2: number) => b2.toString()
      )
    };
  });

  it('should work with simple array', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friendIDs: 'friendIDs'
    };
  });

  it('should work with transformed array', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friendIDs: MapTo.Array(
        'friendIDs',
        (objectId: number) => objectId,
        (entityId: number) => entityId
      )
    };
  });

  it('should not work with badly transformed array', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      // @ts-expect-error
      friendIDs: MapTo.Array(
        'friendIDs',
        (objectId: string) => objectId,
        (entityId: string) => entityId
      )
    };
  });

  it('should work with nullable array', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friendIDsNullable: 'friendIDsNullable'
    };
  });

  it('should work with transformed nullable array', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friendIDsNullable: MapTo.Array(
        'friendIDsNullable',
        (objectId: number) => objectId,
        (entityId: number) => entityId
      )
    };
  });

  it('should work with object array', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friends: 'friends'
    };
  });

  it('should work with object array, with transformation', () => {
    const elementMapping: Mapping<FriendObject, FriendObject> = {
      name: 'name',
      age: 'age',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friends: MapTo.ObjectArray('friends', elementMapping)
    };
  });

  it('should work with nullable object array', () => {
    const elementMapping: Mapping<FriendObject, FriendObject> = {
      name: 'name',
      age: 'age',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      friendsNullable: MapTo.ObjectArray('friends_nullable', elementMapping)
    };
  });

  it('should not work with nullable object array, incompatible types', () => {
    const elementMapping: Mapping<FriendObject, FriendObject> = {
      name: 'name',
      age: 'age',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      // @ts-expect-error
      friendsNullable: MapTo.ObjectArray('friends', elementMapping)
    };
  });

  it('should work with nested object', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      features: 'features'
    };
  });

  it('should work with nested object, with tranformation', () => {
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject, false> = {
      color: 'color',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      features: MapTo.NestedObject('features', featuresMapping)
    };
  });

  it('should work with nested nullable object', () => {
    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      featuresNullable: 'features_nullable'
    };
  });

  it('should work with nested nullable object, with transformation', () => {
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level',
      additional: 'additional'
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      featuresNullable: MapTo.NestedObject('features_nullable', featuresMapping)
    };
  });

  it('should not work with incomplete mapping', () => {
    // @ts-expect-error
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level'
    };
  });

  it('should not work with nested nullable object, incompatible types', () => {
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level',
      additional: 'additional'
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      // @ts-expect-error
      featuresNullable: MapTo.NestedObject('features', featuresMapping)
    };
  });

  it('should not work with nested nullable object, incompatible types', () => {
    const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
      serialNumber: 'index',
      index: 'serialNumber'
    };

    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level',
      additional: MapTo.NestedObject('additional', additionalMapping)
    };
  });

  it('should work with multi-nested object', () => {
    const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
      serialNumber: 'serialNumber',
      index: 'index'
    };

    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level',
      additional: MapTo.NestedObject('additional', additionalMapping)
    };

    const mapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
      features: MapTo.NestedObject('features', featuresMapping)
    };
  });
});
