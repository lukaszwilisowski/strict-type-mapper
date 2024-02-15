# Strict Type Mapper

StrictTypeMapper is a Mapper / AutoMapper library that uses advanced **Compile-time type checking** to enforce strict type compatibility. The checks are more strict than standard TypeScript constraints which helps catching runtime errors.

This library has been originally designed to **map domain types to DB types** as a part of [domain-repository](https://www.npmjs.com/package/domain-repository) npm package, but recently it has been published as a separate library.

NOTE: if you have an error in mapping, it probably means that you are trying to map Optional type to non-Optional type or vice versa. Unfortunately, TypesScript does not provide meaningful error messages in such cases so you have to believe that library is right and your code is wrong :-)

If you want to see some TypeScript hacks, please check the following files:

- [Strict Mapping ✨ interface](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/interfaces/mapping.interface.ts)
- [Magic ✨ types](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/helper.types.ts)
- [Mapping transforms](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/interfaces/mapping.transforms.ts)
- [MapTo() utility functions](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/map.to.helper.ts)

## 1. Installation

```bash
npm install strict-type-mapper
```

## 2 Getting started

### 2.1 Strict type mapping

Define a strict mapping by creating an object of type `Mapping<Source, Target>`.

```typescript
type Source = {
  name: string;
  age: number;
};

type Target = {
  name: string;
  age: number;
};

const mapping: Mapping<Source, Target> = {
  name: 'name',
  age: 'age'
};
```

When you make mistake in types, the compiler will scream:

```typescript
type Source = {
  name?: string;
  age: number;
};

type Target = {
  name: string; //ERROR! this needs to be optional to be mappable to sourceName
  age: number;
};

const mapping: Mapping<Source, Target> = {
  // @ts-expect-error
  name: 'targetName',
  age: 'targetAge'
};
```

### 2.2 Initialize StrictTypeMapper

Initialize StrictTypeMapper class, by providing **explicit** `Source` and
`Target` type parameters.

```typescript
const typeMapper = new StrictTypeMapper<Source, Target>(mapping);
```

### 2.3 Mapping objects

Use `map()` function to map `Source` to `Target` type.

```typescript
const source: Source = {
  sourceName: 'Jack',
  sourceAge: 21
};

const target = typeMapper.map(source);

expect(target.targetName).toEqual('Jack');
expect(target.targetAge).toBe(21);
```

Use `mapReverse()` function to map `Target` to `Source` type.

## 3. Custom transformations

You can also provide transformation functions to map properties and reverse transformations using [MapTo() utility functions](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/map.to.helper.ts).

Remember to **exclude** `undefined` checks (even if type is optional), because this is handled automatically by the library.

`Null` is treated as a valid value, so you need to handle it explicitly.

```typescript
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
```

## 4. Complex and nested type mapping

Use it when you want to map complex and nested types. Example type:

```typescript
export type FriendObject = {
  name: string;
  age: number;
  level?: number;
};

export type AdditionalObject = {
  serialNumber: string;
  index?: number;
};

export type FeaturesObject = {
  color: string;
  level?: number;
  additional?: AdditionalObject;
};

export type AnimalObject = {
  name: string;
  name2: string;
  name3: string;
  nameNullable?: string;
  age: number;
  ageNullable?: number | null;
  friendIDs: number[];
  friendIDsNullable?: number[];
  friends: FriendObject[];
  friendsNullable?: FriendObject[];
  features: FeaturesObject;
  featuresNullable?: FeaturesObject;
};
```

Example complex mapping:

```typescript
export const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
  serialNumber: MapTo.Property(
    'serialNumber',
    (sourceSN: string) => sourceSN + '_new',
    (targetSN: string) => targetSN.replace('_new', '')
  ),
  index: 'index'
};

export const friendMapping: Mapping<FriendObject, FriendObject> = {
  age: MapTo.Property(
    'age',
    (sourceAge: number) => sourceAge + 1,
    (targetAge: number) => targetAge - 1
  ),
  name: 'name',
  level: 'level'
};

export const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
  color: MapTo.Property(
    'color',
    (sourceColor: string) => sourceColor + '_changed',
    (targetColor: string) => targetColor.replace('_changed', '')
  ),
  level: MapTo.Property(
    'level',
    (sourceLevel: number) => sourceLevel + 3,
    (targetLevel: number) => targetLevel - 3
  ),
  additional: MapTo.NestedObject('additional', additionalMapping)
};

export const complexMapping: Mapping<AnimalObject, MappedAnimalObject> = {
  name: 'name2',
  name2: 'name3',
  name3: 'name',
  nameNullable: MapTo.Property(
    'nameNullable',
    (sourceName: string) => sourceName.toUpperCase(),
    (targetName: string) => targetName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (sourceAge: number) => sourceAge + 1,
    (targetAge: number) => targetAge - 1
  ),
  ageNullable: MapTo.Property(
    'age_nullable',
    (sourceAge: number | null): number | null => sourceAge || 0,
    (targetAge: number | null): number | null => targetAge || 0
  ),
  friendIDsNullable: MapTo.Array(
    'friendIDsNullable',
    (sourceFriendId: number) => -sourceFriendId,
    (targetFriendId: number) => -targetFriendId
  ),
  friends: MapTo.ObjectArray('friends', friendMapping),
  friendsNullable: MapTo.ObjectArray('friends_nullable', friendMapping),
  friendIDs: 'friendIDs',
  features: MapTo.NestedObject('features', featuresMapping),
  featuresNullable: MapTo.NestedObject('features_nullable', featuresMapping)
};
```

## 5. Partial mapping

In principle you should map all properties, to make sure the types are correct. If you want to make some properties optional, add `?` to their type definition (for both `Source` and `Target` types).

In rare cases when you want to map a **subtype** of `Source`, use Pick type or create a dedicated subset type, as shown here:

```typescript
export type PartialAnimal = Pick<AnimalObject, 'name' | 'name2' | 'name3' | 'nameNullable' | 'age'>;

export const partialMapping: Mapping<PartialAnimal, MappedAnimalObject> = {
  name: 'name2',
  name2: 'name3',
  name3: 'name',
  nameNullable: MapTo.Property(
    'nameNullable',
    (sourceName: string) => sourceName.toUpperCase(),
    (targetName: string) => targetName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (sourceAge: number) => sourceAge + 1,
    (targetAge: number) => targetAge - 1
  )
};
```

## 6. Optional mapping

In rare cases when you want to make all mappings **optional**, set the 3rd type parameter of `Mapping` and `StrictTypeMapper` to `false`.

```typescript
export const optionalMapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
  name: 'name2',
  name2: 'name3',
  name3: 'name',
  nameNullable: MapTo.Property(
    'nameNullable',
    (sourceName: string) => sourceName.toUpperCase(),
    (targetName: string) => targetName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (sourceAge: number) => sourceAge + 1,
    (targetAge: number) => targetAge - 1
  )
};
```

The `false` type parameter will change the output types to `Partial<Source>` and `Partial<Target>`.

## 7. Mapping details:

Sometimes you may want to get all mapping details, for example to check if all properties are mapped correctly.

To get all mapping details use `getCompiledMapping` method.

```typescript
const sourceKeys = partialMapper.getCompiledMapping().sourceKeys;

expect(sourceKeys).toContain('name');
expect(sourceKeys).toContain('name2');
expect(sourceKeys).toContain('name3');
```

All details:

```typescript
export class CompiledMapping {
  public readonly sourceKeys: string[];
  public readonly nestedSourceKeys: string[];
  public readonly targetKeyToSourceKeyMap: Record<string, string>;
  public readonly sourceKeyToTargetKeyMap: Record<string, string>;
  public readonly targetKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetKeyToNestedMapping: Record<string, CompiledMapping>;
  public readonly sourceKeyToNestedMapping: Record<string, CompiledMapping>;
```
