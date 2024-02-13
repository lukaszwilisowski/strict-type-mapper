export class CompiledMapping {
  public readonly inputKeys: string[];
  public readonly nestedInputKeys: string[];
  public readonly outputKeyToInputKeyMap: Record<string, string>;
  public readonly inputKeyToOutputKeyMap: Record<string, string>;
  public readonly outputKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly inputKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly outputElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly inputElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly outputKeyToNestedMapping: Record<string, CompiledMapping>;
  public readonly inputKeyToNestedMapping: Record<string, CompiledMapping>;

  constructor() {
    this.inputKeys = [];
    this.nestedInputKeys = [];
    this.outputKeyToInputKeyMap = {};
    this.inputKeyToOutputKeyMap = {};
    this.outputKeyToFuncMap = {};
    this.inputKeyToFuncMap = {};
    this.outputElementKeyToFuncMap = {};
    this.inputElementKeyToFuncMap = {};
    this.outputKeyToNestedMapping = {};
    this.inputKeyToNestedMapping = {};
  }
}
