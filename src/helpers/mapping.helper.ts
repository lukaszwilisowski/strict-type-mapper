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
      cm.outputKeyToInputKeyMap[key] = transformProperty.targetKey;
      cm.outputKeyToFuncMap[key] = transformProperty.transformer;
      //reversed keys
      cm.inputKeyToOutputKeyMap[transformProperty.targetKey] = key;
      cm.inputKeyToFuncMap[transformProperty.targetKey] = transformProperty.reverseTransformer;
      //entity key
      cm.inputKeys.push(transformProperty.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArray) {
      //transform array
      const transformArray = keyMapping as TransformArray<string, unknown, unknown>;
      cm.outputKeyToInputKeyMap[key] = transformArray.targetKey;
      cm.outputElementKeyToFuncMap[key] = transformArray.elementTransformer;
      //reversed keys
      cm.inputKeyToOutputKeyMap[transformArray.targetKey] = key;
      cm.inputElementKeyToFuncMap[transformArray.targetKey] = transformArray.reverseElementTransformer;
      //entity key
      cm.inputKeys.push(transformArray.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArrayOfObjects) {
      //transform array of objects
      const transformObjectArray = keyMapping as TransformArrayOfObjects<string, unknown>;
      //map nested object key to entity's counterpart
      cm.outputKeyToInputKeyMap[key] = transformObjectArray.targetKey;
      cm.inputKeyToOutputKeyMap[transformObjectArray.targetKey] = key;
      //entity key
      cm.inputKeys.push(transformObjectArray.targetKey);
      cm.nestedInputKeys.push(transformObjectArray.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformObjectArray.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.outputKeyToNestedMapping[key] = compiledNestedMapping;
      cm.inputKeyToNestedMapping[transformObjectArray.targetKey] = compiledNestedMapping;
      continue;
    }

    if (keyMapping instanceof TransformNestedObject) {
      //transform nested object
      const transformNestedObject = keyMapping as TransformNestedObject<string, unknown>;
      //map nested object key to entity's counterpart
      cm.outputKeyToInputKeyMap[key] = transformNestedObject.targetKey;
      cm.inputKeyToOutputKeyMap[transformNestedObject.targetKey] = key;
      //entity keys
      cm.inputKeys.push(transformNestedObject.targetKey);
      cm.nestedInputKeys.push(transformNestedObject.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformNestedObject.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.outputKeyToNestedMapping[key] = compiledNestedMapping;
      cm.inputKeyToNestedMapping[transformNestedObject.targetKey] = compiledNestedMapping;

      continue;
    }

    //default, no transformation function
    cm.outputKeyToInputKeyMap[key] = keyMapping as string;
    cm.inputKeyToOutputKeyMap[keyMapping as string] = key;
    //entity key
    cm.inputKeys.push(keyMapping as string);
  }

  return cm;
};
