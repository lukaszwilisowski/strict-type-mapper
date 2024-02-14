import { MapTo } from 'helpers/map.to.helper';
import { Mapping } from 'interfaces/mapping.interface';
import { AdditionalObject, AnimalObject, FeaturesObject, FriendObject, MappedAnimalObject } from './animal.models';

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
