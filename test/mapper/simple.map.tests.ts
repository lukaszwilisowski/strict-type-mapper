import { describe, expect, it } from '@jest/globals';
import { MapTo } from 'helpers/map.to.helper';
import { StrictTypeMapper } from 'strict.type.mapper';

describe('Simple mapper', () => {
  it('should map name and age', () => {
    const typeMapper = new StrictTypeMapper<
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

    const target = typeMapper.map({
      name: 'Jack',
      age: 21
    });

    expect(target.name).toEqual('Jack');
    expect(target.age).toBe(21);
  });

  it('should map undefined name and age', () => {
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

    const target = typeMapper.map({
      age: 21
    });

    expect(target.name).toBeUndefined();
    expect(target.age).toBe(21);
  });

  it('should map nullable name and age', () => {
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

    const target = typeMapper.map({
      name: null,
      age: 21
    });

    expect(target.name).toBeNull();
    expect(target.age).toBe(21);
  });

  it('should map nullable undefined name and age', () => {
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

    const target = typeMapper.map({
      name: null,
      age: 21
    });

    expect(target.name).toBeNull();
    expect(target.age).toBe(21);
  });

  it('should map with mapper', () => {
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
        (sourceName: string | null): string | null => sourceName?.toUpperCase() || 'AA',
        (targetName: string | null): string | null => targetName?.toLowerCase() || 'BB'
      ),
      age: MapTo.Property(
        'age',
        (sourceAge: number): number => sourceAge + 1,
        (targetAge: number): number => targetAge - 1
      )
    });

    const target = typeMapper.map({
      name: null,
      age: 21
    });

    expect(target.name).toEqual('AA');
    expect(target.age).toBe(22);
  });
});
