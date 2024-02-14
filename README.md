# Strict Type Mapper

This is an extension of popular Mapper / AutoMapper libraries that map one type to another. By using few TypeScript hacks, this library is able to check both types more carefully than other libraries and standard TypeScript constraints. This results in lower risk of runtime errors.

This library has been originally designed to **map domain types to DB types** as a part of `domain-repository` npm package, but since then, it has been made a separate library.

NOTE: if you have an error in mapping, it probably means that you are trying to map Optional type to non-Optional type or vice versa. Unfortunately, TypesScript does not provide meaningful error messages in such cases so you have to believe that library is right and your code is wrong :-)

If you want to see the TypeScript magic, please check those files:

- [Strict Mapping ✨ interface](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/interfaces/mapping.interface.ts)
- [Magic ✨ types](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/helper.types.ts)
- [Mapping transforms](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/interfaces/mapping.transforms.ts)
- [MapTo() utility functions](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/map.to.helper.ts)

## 1. Installation

```bash
npm install strict-type-mapper
```

## 2. Use cases and examples

### 2.1 Simple type mapping

Note: When initializing StrictTypeMapper, **always provide** explicit `Source` and
`Target` type parameters.

The third type parameter is optional and is used if you want to map only a subset of properties.

```typescript
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
```

When you make mistake in types, the library will scream:

```typescript
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
```

### 2.2 Transformations

You can also provide transformation functions to map properties and reverse transformations using [MapTo() utility functions](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/map.to.helper.ts).

Remember to **exclude** `undefined` checks (even if type is optional), because this is handled automatically by the library.

`Null` is treated as a valid value, so you need to handle it explicitly.

```typescript
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
```

### 2.3 Reverse mapping

Use it when you want to map from `Target` to `Source` type.

```typescript
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
```

### 2.4 Complex and nested type mapping

Use it when you want to map complex and nested types.

Example type:

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
    (outputSN: string) => outputSN + '_new',
    (inputSN: string) => inputSN.replace('_new', '')
  ),
  index: 'index'
};

export const friendMapping: Mapping<FriendObject, FriendObject> = {
  age: MapTo.Property(
    'age',
    (outputAge: number) => outputAge + 1,
    (inputAge: number) => inputAge - 1
  ),
  name: 'name',
  level: 'level'
};

export const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
  color: MapTo.Property(
    'color',
    (outputColor: string) => outputColor + '_changed',
    (inputColor: string) => inputColor.replace('_changed', '')
  ),
  level: MapTo.Property(
    'level',
    (outputLevel: number) => outputLevel + 3,
    (inputLevel: number) => inputLevel - 3
  ),
  additional: MapTo.NestedObject('additional', additionalMapping)
};

export const complexMapping: Mapping<AnimalObject, MappedAnimalObject> = {
  name: 'name2',
  name2: 'name3',
  name3: 'name',
  nameNullable: MapTo.Property(
    'nameNullable',
    (outputName: string) => outputName.toUpperCase(),
    (inputName: string) => inputName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (outputAge: number) => outputAge + 1,
    (inputAge: number) => inputAge - 1
  ),
  ageNullable: MapTo.Property(
    'age_nullable',
    (outputAge: number | null): number | null => outputAge || 0,
    (inputAge: number | null): number | null => inputAge || 0
  ),
  friendIDsNullable: MapTo.Array(
    'friendIDsNullable',
    (outputFriendId: number) => -outputFriendId,
    (inputFriendId: number) => -inputFriendId
  ),
  friends: MapTo.ObjectArray('friends', friendMapping),
  friendsNullable: MapTo.ObjectArray('friends_nullable', friendMapping),
  friendIDs: 'friendIDs',
  features: MapTo.NestedObject('features', featuresMapping),
  featuresNullable: MapTo.NestedObject('features_nullable', featuresMapping)
};
```

### 2.5 Partial mapping

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
    (outputName: string) => outputName.toUpperCase(),
    (inputName: string) => inputName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (outputAge: number) => outputAge + 1,
    (inputAge: number) => inputAge - 1
  )
};
```

### 2.6 Optional mapping

In rare cases when you want to make all mappings **optional**, set the 3rd type parameter of `Mapping` and `StrictTypeMapper` to `false`.

```typescript
export const optionalMapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
  name: 'name2',
  name2: 'name3',
  name3: 'name',
  nameNullable: MapTo.Property(
    'nameNullable',
    (outputName: string) => outputName.toUpperCase(),
    (inputName: string) => inputName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (outputAge: number) => outputAge + 1,
    (inputAge: number) => inputAge - 1
  )
};
```

The `false` type parameter will change the output types to `Partial<Source>` and `Partial<Target>`.

## 3. Mapping details:

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
