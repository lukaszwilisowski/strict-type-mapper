import { compileMappings } from './helpers/mapping.helper';
import { Mapping } from './interfaces/mapping.interface';
import { CompiledMapping } from './models/compiled.mapping';

/**
 * Takes input of type `I` and maps it to output of type `O` or vice versa.
 *
 * @type `I` input type.
 * @type `O` output type.
 *
 * @param mapping - object of type `Mapping<I, O>`.
 *
 * @example
 * ```typescript
 *type A = { b?: string; c?: boolean };
  type B = { b?: string; c?: string };

  const mapping: Mapping<A, B> = {
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
    c: true
  });

  expect(target.b).toBeUndefined();
  expect(target.c).toBe('true');

  const source = typeMapper.mapReverse(target);

  expect(source.b).toBeUndefined();
  expect(source.c).toBe(true);

 * ```
 */
export class StrictTypeMapper<
  I,
  O,
  MapAll = true,
  Source = MapAll extends true ? I : Partial<I>,
  Target = MapAll extends true ? O : Partial<O>
> {
  private readonly compiledMapping: CompiledMapping;

  public constructor(mapping: Mapping<I, O, MapAll>) {
    this.compiledMapping = compileMappings(mapping);
  }

  /** Gets compiled mappings. */
  public getCompiledMapping(): CompiledMapping {
    return this.compiledMapping;
  }

  /** Maps input . */
  public map(input: Source): Target {
    return this.mapInternal(input, this.compiledMapping);
  }

  /** Maps object criteria into entity criteria. */
  public mapReverse(input: Target): Source {
    return this.mapInternal(input, this.compiledMapping, true);
  }

  private mapInternal<A, B>(input: A, mapping: CompiledMapping, reversed?: boolean): B {
    const mappedOutput: { [k: string]: unknown } = {};

    const keyMap = reversed ? mapping.targetKeyToSourceKeyMap : mapping.sourceKeyToTargetKeyMap;

    for (const key in keyMap) {
      const targetKey = keyMap[key];
      const value = input[key as keyof A];

      //undefined properties cannot be mapped
      if (value === undefined) continue;

      const transformedValue = this.getTransformedValue(key, value, mapping, reversed);

      mappedOutput[targetKey] = transformedValue;
    }

    return mappedOutput as B;
  }

  private getTransformedValue(key: string, value: unknown, mapping: CompiledMapping, reversed?: boolean): unknown {
    //compute transformed value
    let transformedValue: unknown = value;

    const nestedMapping = reversed ? mapping.targetKeyToNestedMapping[key] : mapping.sourceKeyToNestedMapping[key];

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
      ? mapping.targetElementKeyToFuncMap[key]
      : mapping.sourceElementKeyToFuncMap[key];

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
      (reversed ? mapping.targetKeyToFuncMap[key] : mapping.sourceKeyToFuncMap[key]) || //transform found?
      ((i: unknown) => i); //if not, fallback to no-transformation

    transformedValue = Array.isArray(transformedValue)
      ? transformedValue.map((v) => transform(v))
      : transform(transformedValue);

    return transformedValue;
  }
}
