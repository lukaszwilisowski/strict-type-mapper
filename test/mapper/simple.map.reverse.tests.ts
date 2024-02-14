import { describe, expect, it } from '@jest/globals';
import { MapTo } from 'helpers/map.to.helper';
import { StrictTypeMapper } from 'strict.type.mapper';

describe('Simple mapper', () => {
  it('should map reverse name and age', () => {
    const simpleMapper = new StrictTypeMapper<
      {
        name: string;
        age: number;
      },
      {
        name: string;
        age: number;
      }
    >({
      name: 'name',
      age: 'age'
    });

    const source = simpleMapper.mapReverse({
      name: 'Jack',
      age: 21
    });

    expect(source.name).toEqual('Jack');
    expect(source.age).toBe(21);
  });

  it('should map reverse undefined name and age', () => {
    const simpleMapper = new StrictTypeMapper<
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

    const source = simpleMapper.mapReverse({
      age: 21
    });

    expect(source.name).toBeUndefined();
    expect(source.age).toBe(21);
  });

  it('should map reverse nullable name and age', () => {
    const simpleMapper = new StrictTypeMapper<
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

    const source = simpleMapper.mapReverse({
      name: null,
      age: 21
    });

    expect(source.name).toBeNull();
    expect(source.age).toBe(21);
  });

  it('should map reverse nullable undefined name and age', () => {
    const simpleMapper = new StrictTypeMapper<
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

    const source = simpleMapper.mapReverse({
      name: null,
      age: 21
    });

    expect(source.name).toBeNull();
    expect(source.age).toBe(21);
  });

  it('should map reverse with mapper', () => {
    const simpleMapper = new StrictTypeMapper<
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

    const source = simpleMapper.mapReverse({
      name: null,
      age: 21
    });

    expect(source.name).toEqual('BB');
    expect(source.age).toBe(21);
  });
});
