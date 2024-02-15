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
      cm.sourceKeyToTargetKeyMap[key] = transformProperty.targetKey;
      cm.sourceKeyToFuncMap[key] = transformProperty.transformer;
      //reversed keys
      cm.targetKeyToSourceKeyMap[transformProperty.targetKey] = key;
      cm.targetKeyToFuncMap[transformProperty.targetKey] = transformProperty.reverseTransformer;
      //entity key
      cm.targetKeys.push(transformProperty.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArray) {
      //transform array
      const transformArray = keyMapping as TransformArray<string, unknown, unknown>;
      cm.sourceKeyToTargetKeyMap[key] = transformArray.targetKey;
      cm.sourceElementKeyToFuncMap[key] = transformArray.elementTransformer;
      //reversed keys
      cm.targetKeyToSourceKeyMap[transformArray.targetKey] = key;
      cm.targetElementKeyToFuncMap[transformArray.targetKey] = transformArray.reverseElementTransformer;
      //entity key
      cm.targetKeys.push(transformArray.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArrayOfObjects) {
      //transform array of objects
      const transformObjectArray = keyMapping as TransformArrayOfObjects<string, unknown>;
      //map nested object key to entity's counterpart
      cm.sourceKeyToTargetKeyMap[key] = transformObjectArray.targetKey;
      cm.targetKeyToSourceKeyMap[transformObjectArray.targetKey] = key;
      //entity key
      cm.targetKeys.push(transformObjectArray.targetKey);
      cm.nestedTargetKeys.push(transformObjectArray.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformObjectArray.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.sourceKeyToNestedMapping[key] = compiledNestedMapping;
      cm.targetKeyToNestedMapping[transformObjectArray.targetKey] = compiledNestedMapping;
      continue;
    }

    if (keyMapping instanceof TransformNestedObject) {
      //transform nested object
      const transformNestedObject = keyMapping as TransformNestedObject<string, unknown>;
      //map nested object key to entity's counterpart
      cm.sourceKeyToTargetKeyMap[key] = transformNestedObject.targetKey;
      cm.targetKeyToSourceKeyMap[transformNestedObject.targetKey] = key;
      //entity keys
      cm.targetKeys.push(transformNestedObject.targetKey);
      cm.nestedTargetKeys.push(transformNestedObject.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformNestedObject.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.sourceKeyToNestedMapping[key] = compiledNestedMapping;
      cm.targetKeyToNestedMapping[transformNestedObject.targetKey] = compiledNestedMapping;

      continue;
    }

    //default, no transformation function
    cm.sourceKeyToTargetKeyMap[key] = keyMapping as string;
    cm.targetKeyToSourceKeyMap[keyMapping as string] = key;
    //entity key
    cm.targetKeys.push(keyMapping as string);
  }

  return cm;
};
