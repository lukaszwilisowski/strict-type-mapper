import { compileMappings } from './helpers/mapping.helper';
import { Mapping } from './interfaces/mapping.interface';
import { CompiledMapping } from './models/compiled.mapping';

/**
 * A strict type mapper. Takes input of type `I` and maps it to output of type `O` or vice versa.
 *
 * @type `I` input type.
 * @type `O` output type.
 */
export class StrictTypeMapper<I, O, MapAll = true> {
  private readonly compiledMapping: CompiledMapping;

  public constructor(mapping: Mapping<I, O, MapAll>) {
    this.compiledMapping = compileMappings(mapping);
  }

  /** Gets compiled mappings. */
  public getCompiledMapping(): CompiledMapping {
    return this.compiledMapping;
  }

  /** Maps input . */
  public map(input: I): O {
    return this.mapInternal(input, this.compiledMapping);
  }

  /** Maps object criteria into entity criteria. */
  public mapReverse(input: O): I {
    return this.mapInternal(input, this.compiledMapping, true);
  }

  private mapInternal<I, O>(input: I, mapping: CompiledMapping, reversed?: boolean): O {
    const mappedOutput: { [k: string]: unknown } = {};

    const keyMap = reversed ? mapping.inputKeyToOutputKeyMap : mapping.outputKeyToInputKeyMap;

    for (const key in keyMap) {
      const targetKey = keyMap[key];
      const value = input[key as keyof I];

      //undefined properties cannot be mapped
      if (value === undefined) continue;

      const transformedValue = this.getTransformedValue(key, value, mapping, reversed);

      mappedOutput[targetKey] = transformedValue;
    }

    return mappedOutput as O;
  }

  private getTransformedValue(key: string, value: unknown, mapping: CompiledMapping, reversed?: boolean): unknown {
    //compute transformed value
    let transformedValue: unknown = value;

    const nestedMapping = reversed ? mapping.inputKeyToNestedMapping[key] : mapping.outputKeyToNestedMapping[key];

    if (nestedMapping) {
      if (transformedValue === null) {
        //nested object is null (SQL)
        return null;
      } else if (Array.isArray(transformedValue)) {
        //array of objects
        transformedValue = transformedValue.map((v) => this.mapInternal(v, nestedMapping, reversed));
      } else {
        //nested object
        transformedValue = this.mapInternal(transformedValue, nestedMapping, reversed);
      }

      return transformedValue;
    }

    //array transformation
    const arrayElementTansform = reversed
      ? mapping.inputElementKeyToFuncMap[key]
      : mapping.outputElementKeyToFuncMap[key];

    if (arrayElementTansform) {
      if (transformedValue === null) {
        //null array (SQL)
        return null;
      } else if (Array.isArray(transformedValue)) {
        transformedValue = transformedValue.map((v) => arrayElementTansform(v));
      } else {
        transformedValue = arrayElementTansform(transformedValue);
      }

      return transformedValue;
    }

    //primitive transformation
    const transform =
      (reversed ? mapping.inputKeyToFuncMap[key] : mapping.outputKeyToFuncMap[key]) || //transform found?
      ((i: unknown) => i); //if not, fallback to no-transformation

    transformedValue = Array.isArray(transformedValue)
      ? transformedValue.map((v) => transform(v))
      : transform(transformedValue);

    return transformedValue;
  }
}
