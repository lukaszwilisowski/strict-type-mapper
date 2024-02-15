import {
  TransformArray,
  TransformArrayOfObjects,
  TransformNestedObject,
  TransformProperty
} from '../interfaces/mapping.transforms';
import { NoInfer } from './helper.types';

export const MapTo = {
  /**
   * Transforms source property into target property using custom
   * transformation. You can ignore `undefined` and optionality (?) in your functions,     because `undefined` values are handled by default.
   *
   * @param targetKey - target property key.
   * @param transformer - function that transforms source value into target value
   * @param reverseTransformer - reverse transformation function.
   *
   * @example
   * ```typescript
   *type A = { b?: string; c?: boolean };
    type B = { b?: string; c?: string };
  
    const mapping: Mapping<A, B> = {
      b: MapTo.Property(
        'b',
        (sourceB: string) => sourceB.toUpperCase(),
        (targetB: string) => targetB.toLowerCase()
      ),
    };

   * ```
   */
  Property: <K, X, Y>(
    targetKey: K,
    transformer: (sourceValue: X) => NoInfer<Y>,
    reverseTransformer: (targetValue: Y) => X
  ) => new TransformProperty('TransformProperty', targetKey, transformer, reverseTransformer),

  /**
   * Transforms source primitive array property into target primitive array property, using element transformation functions. You can ignore `undefined` and optionality (?) in functions, because `undefined` values are handled by default.
   *
   * @param targetKey - target property key.
   * @param elementTransformer - function that transforms single element of source array into single element of target array.
   * @param reverseElementTransformer - reverse transformation function.
   *
   * @example
   * ```typescript
   *type A = { a: string[] };
    type B = { b: number[] };

    const mapping: Mapping<A, B> = {
      a: MapTo.Array(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString()
      )
    };

   * ```
   **/
  Array: <K, X, Y>(
    targetKey: K,
    elementTransformer: (sourceValue: X) => Y,
    reverseElementTransformer: (targetValue: Y) => X
  ) => new TransformArray('TransformArray', targetKey, elementTransformer, reverseElementTransformer),

  /**
   * Transforms source array of objects property into target array of objects property, using custom transformation. You can ignore `undefined` and optionality (?) in your functions, because `undefined` values are handled by default.
   *
   * @param targetKey - target property key.
   * @param elementTransformer - function that transforms single element of source array into single element of target array.
   * @param reverseElementTransformer - reverse transformation function.
   *
   * @example
   * ```typescript
   *type AElem = {
      name: string;
    };

    type BEelem = {
      name: string;
    };

    const elementMapping: Mapping<AElem, BEelem> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      )
    };

    type A = {
      a: AElem[];
    };

    type B = {
      b: BEelem[];
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.ObjectArray('b', elementMapping)
    };

   * ```
   **/
  ObjectArray: <K, M>(targetKey: K, nestedMapping: M) =>
    new TransformArrayOfObjects('ObjectArray', targetKey, nestedMapping),

  /**
   * Transforms source nested object property into target nested object property, using custom transformation. You can ignore `undefined` and optionality (?) in your functions, because `undefined` values are handled by default.
   *
   * @param targetKey - target property key.
   * @param elementTransformer - function that transforms single element of source array into single element of target array.
   * @param reverseElementTransformer - reverse transformation function.
   *
   * @example
   * ```typescript
   *type ANested = {
      name: string;
    };

    type BNested = {
      name: string;
    };

    const elementMapping: Mapping<ANested, BNested> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      )
    };

    type A = {
      a: ANested;
    };

    type B = {
      b: BNested;
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.NestedObject('b', elementMapping)
    };

   * ```
   **/
  NestedObject: <K, M>(targetKey: K, nestedMapping: M) =>
    new TransformNestedObject('NestedObject', targetKey, nestedMapping)
};
