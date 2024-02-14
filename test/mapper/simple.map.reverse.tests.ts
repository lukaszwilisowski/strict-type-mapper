import { describe, expect, it } from '@jest/globals';
import { MapTo } from 'helpers/map.to.helper';
import { Mapping } from 'interfaces/mapping.interface';
import { StrictTypeMapper } from 'strict.type.mapper';

describe('Simple mapper', () => {
  it('should map reverse name and age', () => {
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

    const source = typeMapper.mapReverse({
      targetName: 'Jack',
      targetAge: 21
    });

    expect(source.sourceName).toEqual('Jack');
    expect(source.sourceAge).toBe(21);
  });

  it('should map reverse undefined name and age', () => {
    const typeMapper = new StrictTypeMapper<
      {
        name?: string;
        age: number;
      },
      {
        name?: string;
        age: number;
      }
    >({
      name: 'name',
      age: 'age'
    });

    const source = typeMapper.mapReverse({
      age: 21
    });

    expect(source.name).toBeUndefined();
    expect(source.age).toBe(21);
  });

  it('should map reverse nullable name and age', () => {
    const typeMapper = new StrictTypeMapper<
      {
        name: string | null;
        age: number;
      },
      {
        name: string | null;
        age: number;
      }
    >({
      name: 'name',
      age: 'age'
    });

    const source = typeMapper.mapReverse({
      name: null,
      age: 21
    });

    expect(source.name).toBeNull();
    expect(source.age).toBe(21);
  });

  it('should map reverse nullable undefined name and age', () => {
    const typeMapper = new StrictTypeMapper<
      {
        name?: string | null;
        age: number;
      },
      {
        name?: string | null;
        age: number;
      }
    >({
      name: 'name',
      age: 'age'
    });

    const source = typeMapper.mapReverse({
      name: null,
      age: 21
    });

    expect(source.name).toBeNull();
    expect(source.age).toBe(21);
  });

  it('should map reverse with mapper', () => {
    const typeMapper = new StrictTypeMapper<
      {
        name?: string | null;
        age: number;
      },
      {
        name?: string | null;
        age: number;
      }
    >({
      name: MapTo.Property(
        'name',
        (inputName: string | null): string | null => inputName?.toUpperCase() || 'AA',
        (outputName: string | null): string | null => outputName?.toLowerCase() || 'BB'
      ),
      age: 'age'
    });

    const source = typeMapper.mapReverse({
      name: null,
      age: 21
    });

    expect(source.name).toEqual('BB');
    expect(source.age).toBe(21);
  });
});
