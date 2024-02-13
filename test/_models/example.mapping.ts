import { MapTo } from 'helpers/map.to.helper';
import { Mapping } from 'interfaces/mapping.interface';
import { AdditionalObject, AnimalObject, FeaturesObject, FriendObject, MappedAnimalObject } from './animal.models';

export const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
  serialNumber: MapTo.Property(
    'serialNumber',
    (objectSN: string) => objectSN + '_new',
    (entitySN: string) => entitySN.replace('_new', '')
  ),
  index: 'index'
};

export const friendMapping: Mapping<FriendObject, FriendObject, false> = {
  age: MapTo.Property(
    'age',
    (objectAge: number) => objectAge + 1,
    (entityAge: number) => entityAge - 1
  )
};

export const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
  color: MapTo.Property(
    'color',
    (objectColor: string) => objectColor + '_changed',
    (entityColor: string) => entityColor.replace('_changed', '')
  ),
  level: MapTo.Property(
    'level',
    (objectLevel: number) => objectLevel + 3,
    (entityLevel: number | null) => (entityLevel || 0) - 3
  ),
  additional: MapTo.NestedObject('additional', additionalMapping)
};

export const complexMapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
  name: 'name2',
  name2: 'name3',
  nameNullable: MapTo.Property(
    'nameNullable',
    (objectName: string) => objectName.toUpperCase(),
    (entityName: string | null) => entityName?.toLowerCase() || 'default'
  ),
  age: MapTo.Property(
    'age',
    (objectAge: number) => objectAge + 1,
    (entityAge: number) => entityAge - 1
  ),
  ageNullable: MapTo.Property(
    'age_nullable',
    (objectAge: number | null) => objectAge || 0,
    (entityAge: number | null) => entityAge || 0
  ),
  friendIDsNullable: MapTo.Array(
    'friendIDsNullable',
    (objectFriendId: number) => -objectFriendId,
    (entityFriendId: number) => -entityFriendId
  ),
  friends: MapTo.ObjectArray('friends', friendMapping),
  friendsNullable: MapTo.ObjectArray('friends_nullable', friendMapping),
  features: MapTo.NestedObject('features', featuresMapping),
  featuresNullable: MapTo.NestedObject('features_nullable', featuresMapping)
};
