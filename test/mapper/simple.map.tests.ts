import { describe, expect, it } from '@jest/globals';
import { MapTo } from 'helpers/map.to.helper';
import { Mapping } from 'interfaces/mapping.interface';
import { StrictTypeMapper } from 'strict.type.mapper';

describe('Simple mapper', () => {
  it('should map sourceName and age', () => {
    type Source = {
      sourceName: string;
      sourceAge: number;
    };

    type Target = {
      targetName: string;
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      sourceName: 'targetName',
      sourceAge: 'targetAge'
    };

    const typeMapper = new StrictTypeMapper<Source, Target>(mapping);

    const target = typeMapper.map({
      sourceName: 'Jack',
      sourceAge: 21
    });

    expect(target.targetName).toEqual('Jack');
    expect(target.targetAge).toBe(21);
  });

  it('should not map wrong types', () => {
    type Source = {
      sourceName?: string;
      sourceAge: number;
    };

    type Target = {
      targetName: string;
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      // @ts-expect-error
      sourceName: 'targetName', //the same optionality required
      sourceAge: 'targetAge'
    };
  });

  it('should not map wrong types 2', () => {
    type Source = {
      sourceName: string;
      sourceAge: number;
    };

    type Target = {
      targetName?: string; //the same optionality required
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      // @ts-expect-error
      sourceName: 'targetName',
      sourceAge: 'targetAge'
    };
  });

  it('should map optional sourceName and age', () => {
    type Source = {
      sourceName?: string;
      sourceAge: number;
    };

    type Target = {
      targetName?: string;
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      sourceName: 'targetName',
      sourceAge: 'targetAge'
    };

    const typeMapper = new StrictTypeMapper<Source, Target>(mapping);

    const target = typeMapper.map({
      sourceName: undefined,
      sourceAge: 21
    });

    expect(target.targetName).toBeUndefined();
    expect(target.targetAge).toBe(21);
  });

  it('should map nullable sourceName and age', () => {
    type Source = {
      sourceName: string | null;
      sourceAge: number;
    };

    type Target = {
      targetName: string | null;
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      sourceName: 'targetName',
      sourceAge: 'targetAge'
    };

    const typeMapper = new StrictTypeMapper<Source, Target>(mapping);

    const target = typeMapper.map({
      sourceName: null,
      sourceAge: 21
    });

    expect(target.targetName).toBeNull();
    expect(target.targetAge).toBe(21);
  });

  it('should map nullable undefined sourceName and age', () => {
    type Source = {
      sourceName?: string | null;
      sourceAge: number;
    };

    type Target = {
      targetName?: string | null;
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      sourceName: 'targetName',
      sourceAge: 'targetAge'
    };

    const typeMapper = new StrictTypeMapper<Source, Target>(mapping);

    const target = typeMapper.map({
      sourceName: null,
      sourceAge: 21
    });

    expect(target.targetName).toBeNull();
    expect(target.targetAge).toBe(21);
  });

  it('should map with transformations', () => {
    type Source = {
      sourceName?: string | null;
      sourceAge: number;
    };

    type Target = {
      sourceName?: string | null;
      targetAge: number;
    };

    const mapping: Mapping<Source, Target> = {
      sourceName: MapTo.Property(
        'sourceName',
        (sourceName: string | null): string | null => sourceName || 'AA',
        (targetName: string | null): string | null => targetName || 'BB'
      ),
      sourceAge: MapTo.Property(
        'targetAge',
        (sourceAge: number) => sourceAge + 1,
        (targetAge: number) => targetAge - 1
      )
    };

    const typeMapper = new StrictTypeMapper<Source, Target>(mapping);

    const target = typeMapper.map({
      sourceName: null,
      sourceAge: 21
    });

    expect(target.sourceName).toEqual('AA');
    expect(target.targetAge).toBe(22);
  });

  it('should map with transformations 2', () => {
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

    const typeMapper = new StrictTypeMapper<A, B>(mapping);

    const target = typeMapper.map({
      a: 1,
      b: 'hello',
      c: true
    });

    expect(target.a).toBe(1);
    expect(target.b).toEqual('HELLO');
    expect(target.c).toBe('true');

    const source = typeMapper.mapReverse(target);

    expect(source.a).toBe(1);
    expect(source.b).toEqual('hello');
    expect(source.c).toBe(true);
  });

  it('should map with transformations and undefined', () => {
    type A = { b?: string; c?: boolean };
    type B = { b?: string; c?: string };

    const mapping: Mapping<A, B> = {
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

    const typeMapper = new StrictTypeMapper<A, B>(mapping);

    const target = typeMapper.map({
      c: true
    });

    expect(target.b).toBeUndefined();
    expect(target.c).toBe('true');

    const source = typeMapper.mapReverse(target);

    expect(source.b).toBeUndefined();
    expect(source.c).toBe(true);
  });
});
