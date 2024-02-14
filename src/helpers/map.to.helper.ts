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
   * transformation. You have to provide both tranformer and
   * reverseTransformer functions.
   *
   * You can ignore undefined and optionality in your source types, because
   * `undefined` values are just ommitted and mapped to `undefined` by default.
   * You cannot change that.
   */
  Property: <K, X, Y>(
    targetKey: K,
    transformer: (sourceValue: X) => NoInfer<Y>,
    reverseTransformer: (targetValue: Y) => X
  ) => new TransformProperty('TransformProperty', targetKey, transformer, reverseTransformer),

  /**
   * Transforms source array property into target array property, using array element transformer and reverseTransformer functions.
   *
   * You can ignore undefined and optionality in your source types, because
   * `undefined` values are just ommitted and mapped to `undefined` by default.
   * You cannot change that.
   */
  Array: <K, X, Y>(
    targetKey: K,
    elementTransformer: (sourceValue: X) => Y,
    reverseElementTransformer: (targetValue: Y) => X
  ) => new TransformArray('TransformArray', targetKey, elementTransformer, reverseElementTransformer),

  /**
   * Transforms source array of objects into target array of objects, using nested mapping.
   */
  ObjectArray: <K, M>(targetKey: K, nestedMapping: M) =>
    new TransformArrayOfObjects('ObjectArray', targetKey, nestedMapping),

  /**
   * Transforms source object property into target object property, using nested mapping.
   */
  NestedObject: <K, M>(targetKey: K, nestedMapping: M) =>
    new TransformNestedObject('NestedObject', targetKey, nestedMapping)
};
