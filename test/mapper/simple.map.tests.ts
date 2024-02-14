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

  it('should not map wrong properties', () => {
    type Source = {
      sourceName?: string;
      sourceAge: number;
    };

    type Target = {
      targetName: string; //ERROR! this needs to be optional to be mappable to sourceName
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
        (sourceName: string | null): string | null => sourceName?.toUpperCase() || 'AA',
        (targetName: string | null): string | null => targetName?.toLowerCase() || 'BB'
      ),
      sourceAge: MapTo.Property(
        'targetAge',
        (sourceAge: number): number => sourceAge + 1,
        (targetAge: number): number => targetAge - 1
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
});
