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

export type MappedAnimalObject = {
  name: string;
  name2: string;
  name3: string;
  nameNullable?: string;
  age: number;
  age_nullable?: number | null;
  friendIDs: number[];
  friendIDsNullable?: number[];
  friends: FriendObject[];
  friends_nullable?: FriendObject[];
  features: FeaturesObject;
  features_nullable?: FeaturesObject;
};
