import { NonNullablePropsOf, NonUndefined, PrimitiveTypes } from '../helpers/helper.types';
import {
  TransformArray,
  TransformArrayOfObjects,
  TransformNestedObject,
  TransformProperty
} from './mapping.transforms';

/**
 * Strict type mapping of properties between `I` and `O` types. Designed for DB domain model mappings. Uses stricter type constraints than standard Typescript.
 *
 * 1. If you use name-to-name mapping, both properties must have exactly the same type and both must be either optional or non-optional.
 * 2. If you map properties with different types you need to use MapTo helper functions and provide custom transformations. There is only one constraint: both properties must be either optional or non-optional.
 * 3. When you want to map a nested object, you must use `MapTo.NestedObject`, with nested mapping.
 * 4. When you want to map an array of objects, you must use `MapTo.ObjectArray`, with nested mapping.
 *
 * @type `MapAll` when set to `false`, allows to map a subset of properties.
 *
 * @example
 * ```ts
  type A = { a: number; b: string; c: boolean };
  type B = { a: number; b: string; c: string };

  const mapping: Mapping<A, B> = {
      a: 'a',
      b: MapTo.Property(
        'b',
        (sourceB: string) => sourceB.toUpperCase(),
        (targetB: string) => targetB.toLowerCase()
      ),
      c: MapTo.Property(
        'c',
        (sourceC: boolean) => (sourceC ? 'true' : 'false'),
        (targetC: string) => targetC === 'true'
      )
  };

 * ```
 */
export type Mapping<I, O, MapAll = true> = MapAll extends true
  ? {
      [P in keyof NonNullablePropsOf<I>]: MappedType<I, O, P, MapAll>;
    }
  : { [P in keyof I]?: MappedType<I, O, P, MapAll> };

type MappedType<I, O, P extends keyof I, MapAll> = keyof O extends infer R
  ? R extends keyof O //this is required so that we can later check for E[R]
    ? I[P] extends PrimitiveTypes | undefined
      ? PrimitiveCompatibleTypes<I, O, P, R>
      : I[P] extends PrimitiveTypes[] | undefined
      ? PrimitiveArrayCompatibleTypes<I, O, P, R>
      : I[P] extends Array<infer X> | undefined
      ? ObjectArrayCompatibleTypes<I, O, P, R, X, MapAll>
      : I[P] extends object | undefined
      ? NestedObjectCompatibletypes<I, O, P, R, MapAll>
      : never
    : never
  : never;

type PrimitiveCompatibleTypes<I, O, P extends keyof I, R extends keyof O> = O[R] extends
  | PrimitiveTypes
  | object
  | undefined
  ? I[P] extends PrimitiveTypes
    ? O[R] extends PrimitiveTypes | object
      ? PropertyCompatibleTypes<I, O, P, R, I[P], O[R]>
      : never
    : I[P] extends PrimitiveTypes | undefined
    ? O[R] extends PrimitiveTypes | object
      ? never
      : PropertyCompatibleTypes<I, O, P, R, NonUndefined<I[P]>, NonUndefined<O[R]>>
    : never
  : //fallback
    never;

type PrimitiveArrayCompatibleTypes<I, O, P extends keyof I, R extends keyof O> = O[R] extends
  | PrimitiveTypes[]
  | undefined
  ? I[P] extends Array<infer X>
    ? O[R] extends Array<infer Y>
      ? ArrayCompatibleTypes<I, O, P, R, X, Y>
      : never
    : I[P] extends Array<infer X> | undefined
    ? O[R] extends Array<infer Y>
      ? never
      : O[R] extends Array<infer Y> | undefined
      ? ArrayCompatibleTypes<I, O, P, R, X, Y>
      : never
    : never
  : //fallback
    never;

//Maybe it can be simplified somehow
type ObjectArrayCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, MapAll> = O[R] extends
  | PrimitiveTypes[]
  | undefined
  ? never
  : I[P] extends Array<infer X>
  ? O[R] extends Array<infer Y>
    ? ArrayOfObjectsCompatibleTypes<I, O, P, R, X, Y, MapAll>
    : never
  : O[R] extends Array<infer Y> | undefined
  ? O[R] extends Array<infer Y>
    ? never
    : ArrayOfObjectsCompatibleTypes<I, O, P, R, X, Y, MapAll>
  : never;

//Maybe it can be simplified somehow
type NestedObjectCompatibletypes<I, O, P extends keyof I, R extends keyof O, MapAll> = O[R] extends
  | PrimitiveTypes
  | PrimitiveTypes[]
  | Array<infer X>
  | undefined
  ? never
  : I[P] extends object
  ? O[R] extends object
    ? NestedObjectCompatibleTypes<I, O, P, R, I[P], O[R], MapAll>
    : never
  : O[R] extends object | undefined
  ? O[R] extends object
    ? never
    : NestedObjectCompatibleTypes<I, O, P, R, I[P], O[R], MapAll>
  : never;

/** Property helper type. */
type PropertyCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y> = I[P] extends O[R]
  ? //property can be mapped directly to another property with the same type
    R | TransformProperty<R, X, Y>
  : //or transformed to another property
    TransformProperty<R, X, Y>;

/** Array helper type. */
type ArrayCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y> = I[P] extends O[R]
  ? //array of primitives can be mapped directly to another array of primitives with the same type
    R | TransformArray<R, X, Y>
  : //or transformed to another array of primitives
    TransformArray<R, X, Y>;

/** Object array helper type. */
type ArrayOfObjectsCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y, MapAll> = I[P] extends O[R]
  ? //array of primitives can be mapped directly to another array of primitives with the same type
    R | TransformArrayOfObjects<R, Mapping<X, Y, MapAll>>
  : //or transformed to another array of primitives
    TransformArrayOfObjects<R, Mapping<X, Y, MapAll>>;

/** Object array helper type. */
type NestedObjectCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y, MapAll> = I[P] extends O[R]
  ? //array of primitives can be mapped directly to another array of primitives with the same type
    R | TransformNestedObject<R, Mapping<NonNullable<X>, NonNullable<Y>, MapAll>>
  : //or transformed to another array of primitives
    TransformNestedObject<R, Mapping<NonNullable<X>, NonNullable<Y>, MapAll>>;
