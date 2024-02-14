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
```

### 2.2 Reverse mapping

Use it when you want to map from `Target` to `Source` type.

```typescript
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
```

### 2.3 Transformations

You can also provide transformation functions to map properties and reverse transformations using [MapTo() utility functions](https://github.com/lukaszwilisowski/strict-type-mapper/blob/main/src/helpers/map.to.helper.ts).

Remember to **exclude** `undefined` checks (even if type is optional), because this is handled automatically by the library.

`Null` is treated as a valid value, so you need to handle it explicitly.

```typescript
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

Use it when you want to map only a subset of properties.

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

Use it when you want to map to Optional<T> types.

Note than you need to set the 3rd type parameter to `false` in the `Mapping` type.

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

The `false` type parameter will change the output type to `Partial<Source>` for `map()` and `Partial<Target>` for `mapReverse()`.

### 2.6 Mapping details:

To get detailed mappings info use `getCompiledMapping` method.

```typescript
const sourceKeys = partialMapper.getCompiledMapping().sourceKeys;

expect(sourceKeys).toContain('name');
expect(sourceKeys).toContain('name2');
expect(sourceKeys).toContain('name3');
```
