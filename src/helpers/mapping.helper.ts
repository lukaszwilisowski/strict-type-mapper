import { Mapping } from '../interfaces/mapping.interface';
import {
  TransformArray,
  TransformArrayOfObjects,
  TransformNestedObject,
  TransformProperty
} from '../interfaces/mapping.transforms';
import { CompiledMapping } from '../models/compiled.mapping';

export const compileMappings = <A, E, MapAll>(mapping: Mapping<A, E, MapAll>): CompiledMapping => {
  const cm = new CompiledMapping();

  for (const key in mapping) {
    const keyMapping = mapping[key];

    if (keyMapping instanceof TransformProperty) {
      //transform property
      const transformProperty = keyMapping as TransformProperty<string, unknown, unknown>;
      cm.targetKeyToSourceKeyMap[key] = transformProperty.targetKey;
      cm.targetKeyToFuncMap[key] = transformProperty.transformer;
      //reversed keys
      cm.sourceKeyToTargetKeyMap[transformProperty.targetKey] = key;
      cm.sourceKeyToFuncMap[transformProperty.targetKey] = transformProperty.reverseTransformer;
      //entity key
      cm.sourceKeys.push(transformProperty.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArray) {
      //transform array
      const transformArray = keyMapping as TransformArray<string, unknown, unknown>;
      cm.targetKeyToSourceKeyMap[key] = transformArray.targetKey;
      cm.targetElementKeyToFuncMap[key] = transformArray.elementTransformer;
      //reversed keys
      cm.sourceKeyToTargetKeyMap[transformArray.targetKey] = key;
      cm.sourceElementKeyToFuncMap[transformArray.targetKey] = transformArray.reverseElementTransformer;
      //entity key
      cm.sourceKeys.push(transformArray.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArrayOfObjects) {
      //transform array of objects
      const transformObjectArray = keyMapping as TransformArrayOfObjects<string, unknown>;
      //map nested object key to entity's counterpart
      cm.targetKeyToSourceKeyMap[key] = transformObjectArray.targetKey;
      cm.sourceKeyToTargetKeyMap[transformObjectArray.targetKey] = key;
      //entity key
      cm.sourceKeys.push(transformObjectArray.targetKey);
      cm.nestedSourceKeys.push(transformObjectArray.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformObjectArray.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.targetKeyToNestedMapping[key] = compiledNestedMapping;
      cm.sourceKeyToNestedMapping[transformObjectArray.targetKey] = compiledNestedMapping;
      continue;
    }

    if (keyMapping instanceof TransformNestedObject) {
      //transform nested object
      const transformNestedObject = keyMapping as TransformNestedObject<string, unknown>;
      //map nested object key to entity's counterpart
      cm.targetKeyToSourceKeyMap[key] = transformNestedObject.targetKey;
      cm.sourceKeyToTargetKeyMap[transformNestedObject.targetKey] = key;
      //entity keys
      cm.sourceKeys.push(transformNestedObject.targetKey);
      cm.nestedSourceKeys.push(transformNestedObject.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformNestedObject.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.targetKeyToNestedMapping[key] = compiledNestedMapping;
      cm.sourceKeyToNestedMapping[transformNestedObject.targetKey] = compiledNestedMapping;

      continue;
    }

    //default, no transformation function
    cm.targetKeyToSourceKeyMap[key] = keyMapping as string;
    cm.sourceKeyToTargetKeyMap[keyMapping as string] = key;
    //entity key
    cm.sourceKeys.push(keyMapping as string);
  }

  return cm;
};
