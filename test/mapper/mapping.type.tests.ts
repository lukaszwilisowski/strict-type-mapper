/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it } from '@jest/globals';
import { MapTo } from 'helpers/map.to.helper';
import { Mapping } from 'interfaces/mapping.interface';

describe('Mapping', () => {
  it('should allow for standard assignments', () => {
    const a: string | undefined = 'a';
    const b: string = a;
    const c: string | undefined = b;
  });

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

  it('should not work when mapping non-optional property to optional property', () => {
    type A = { a: number };
    type B = { b?: number };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should not work when mapping optional property to non-optional property', () => {
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
    type A = { a: number[] };
    type B = { b: number[] };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should work with optional array', () => {
    type A = { a?: string[] };
    type B = { b?: number[] };

    const mapping: Mapping<A, B> = {
      a: MapTo.Array(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString()
      )
    };
  });

  it('should work with transformed array', () => {
    type A = { a: string[] };
    type B = { b: number[] };

    const mapping: Mapping<A, B> = {
      a: MapTo.Array(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString()
      )
    };
  });

  it('should not work with badly transformed array', () => {
    type A = { a: string[] };
    type B = { b: number[] };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Array(
        'b',
        (a: boolean) => a,
        (b: boolean) => b
      )
    };
  });

  it('should not work when mapping optional array to non-optional', () => {
    type A = { a?: string[] };
    type B = { b: number[] };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Array(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString()
      )
    };
  });

  it('should not work when mapping optional array to non-optional', () => {
    type A = { a: string[] };
    type B = { b?: number[] };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Array(
        'b',
        (sourceB: string) => parseInt(sourceB),
        (targetB: number) => targetB.toString()
      )
    };
  });

  it('should work with object array', () => {
    type A = {
      a: {
        name: string;
      }[];
    };

    type B = {
      b: {
        name: string;
      }[];
    };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should work with optional object array', () => {
    type A = {
      a?: {
        name: string;
      }[];
    };

    type B = {
      b?: {
        name: string;
      }[];
    };

    const mapping: Mapping<A, B> = {
      a: 'b'
    };
  });

  it('should not work when mapping optional object array to non-optional', () => {
    type A = {
      a?: {
        name: string;
      }[];
    };

    type B = {
      b: {
        name: string;
      }[];
    };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should not work when mapping non-optional object array to optional', () => {
    type A = {
      a: {
        name: string;
      }[];
    };

    type B = {
      b?: {
        name: string;
      }[];
    };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should work with transformed object array', () => {
    type AElem = {
      name: string;
    };

    type BEelem = {
      name: string;
    };

    type A = {
      a: AElem[];
    };

    type B = {
      b: BEelem[];
    };

    const elementMapping: Mapping<AElem, BEelem> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      )
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.ObjectArray('b', elementMapping)
    };
  });

  it('should not work when mapping non-optional object array to optional with transformation', () => {
    type AElem = {
      name: string;
    };

    type BEelem = {
      name: string;
    };

    type A = {
      a: AElem[];
    };

    type B = {
      b?: BEelem[];
    };

    const elementMapping: Mapping<AElem, BEelem> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      )
    };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.ObjectArray('b', elementMapping)
    };
  });

  it('should work with transformed object array with optional children', () => {
    type AElem = {
      name?: string;
    };

    type BEelem = {
      name?: string;
    };

    type A = {
      a: AElem[];
    };

    type B = {
      b: BEelem[];
    };

    const elementMapping: Mapping<AElem, BEelem> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      )
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.ObjectArray('b', elementMapping)
    };
  });

  it('should work with nested object', () => {
    type ANested = {
      name: string;
      a2: number;
    };

    type BNested = {
      name: string;
      a2: number;
    };

    type A = {
      a: ANested;
    };

    type B = {
      b: BNested;
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: 'name',
      a2: 'a2'
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.NestedObject('b', nestedMapping)
    };
  });

  it('should work with optional nested object', () => {
    type ANested = {
      name: string;
      a2: number;
    };

    type BNested = {
      name: string;
      a2: number;
    };

    type A = {
      a?: ANested;
    };

    type B = {
      b?: BNested;
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: 'name',
      a2: 'a2'
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.NestedObject('b', nestedMapping)
    };
  });

  it('should not work when mapping non-optional nested object to optional', () => {
    type ANested = {
      name: string;
      a2: number;
    };

    type BNested = {
      name: string;
      a2: number;
    };

    type A = {
      a: ANested;
    };

    type B = {
      b?: BNested;
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: 'name',
      a2: 'a2'
    };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.NestedObject('b', nestedMapping)
    };
  });

  it('should work with nested object with optional children', () => {
    type ANested = {
      name?: string;
      a2: number;
    };

    type BNested = {
      name?: string;
      a2: number;
    };

    type A = {
      a: ANested;
    };

    type B = {
      b: BNested;
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: 'name',
      a2: 'a2'
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.NestedObject('b', nestedMapping)
    };
  });

  it('should work with nested object array with transformed children', () => {
    type ANested = {
      name: string;
      a2: number;
    };

    type BNested = {
      name: string;
      a2: number;
    };

    type A = {
      a: ANested;
    };

    type B = {
      b: BNested;
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      ),
      a2: MapTo.Property(
        'a2',
        (sourceA2: number) => sourceA2,
        (targetA2: number) => targetA2
      )
    };

    const mapping: Mapping<A, B> = {
      a: MapTo.NestedObject('b', nestedMapping)
    };
  });

  it('should not work when mapping nested arrays using nested object', () => {
    type ANested = {
      name: string;
      a2: number;
    };

    type BNested = {
      name: string;
      a2: number;
    };

    type A = {
      a: ANested[];
    };

    type B = {
      b: BNested[];
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      ),
      a2: MapTo.Property(
        'a2',
        (sourceA2: number) => sourceA2,
        (targetA2: number) => targetA2
      )
    };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.NestedObject('b', nestedMapping)
    };
  });

  it('should not work when mapping nested objects using nested array', () => {
    type ANested = {
      name: string;
      a2: number;
    };

    type BNested = {
      name: string;
      a2: number;
    };

    type A = {
      a: ANested;
    };

    type B = {
      b: BNested;
    };

    const nestedMapping: Mapping<ANested, BNested> = {
      name: MapTo.Property(
        'name',
        (sourceName: string) => sourceName,
        (targetName: string) => targetName
      ),
      a2: MapTo.Property(
        'a2',
        (sourceA2: number) => sourceA2,
        (targetA2: number) => targetA2
      )
    };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.ObjectArray('b', nestedMapping)
    };
  });

  it('should not work with primitive and object', () => {
    type A = { a: number };
    type B = { b: object };

    const mapping: Mapping<A, B> = {
      // @ts-expect-error
      a: 'b'
    };
  });

  it('should work with primitive and object with transformation', () => {
    class C {
      constructor(a: string) {}
    }

    type A = { a: string };
    type B = { b: C };

    const mapping: Mapping<A, B> = {
      a: MapTo.Property(
        'b',
        (a: string) => new C(a),
        (b: C) => b.toString()
      )
    };
  });

  it('should work with optional primitive and object with transformation', () => {
    class C {
      constructor(a: string) {}
    }

    type A = { a?: string };
    type B = { b?: C };

    const mapping: Mapping<A, B> = {
      a: MapTo.Property(
        'b',
        (a: string) => new C(a),
        (b: C) => b.toString()
      )
    };
  });

  it('should not work when transforming optional primitive to non-optional object', () => {
    class C {
      constructor(a: string) {}
    }

    type A = { a?: C };
    type B = { b: string };

    const mapping1: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Property(
        'b',
        (a: C) => a.toString(),
        (b: string) => new C(b)
      )
    };

    type E = { e?: string };
    type F = { f: C };

    const mapping2: Mapping<E, F> = {
      // @ts-expect-error
      e: MapTo.Property(
        'f',
        (e: string) => new C(e),
        (f: C) => f.toString()
      )
    };
  });

  it('should not work when transforming non-optional primitive to optional object', () => {
    class C {
      constructor(a: string) {}
    }

    type A = { a: string };
    type B = { b?: C };

    const mapping1: Mapping<A, B> = {
      // @ts-expect-error
      a: MapTo.Property(
        'b',
        (a: string) => new C(a),
        (b: C) => b.toString()
      )
    };

    type E = { e: C };
    type F = { f?: string };

    const mapping2: Mapping<E, F> = {
      // @ts-expect-error
      e: MapTo.Property(
        'f',
        (e: C) => e.toString(),
        (f: string) => new C(f)
      )
    };
  });
});
