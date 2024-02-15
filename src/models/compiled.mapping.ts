export class CompiledMapping {
  public readonly targetKeys: string[];
  public readonly nestedTargetKeys: string[];
  public readonly sourceKeyToSourceKeyMap: Record<string, string>;
  public readonly targetKeyToTargetKeyMap: Record<string, string>;
  public readonly sourceKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceKeyToNestedMapping: Record<string, CompiledMapping>;
  public readonly targetKeyToNestedMapping: Record<string, CompiledMapping>;

  constructor() {
    this.targetKeys = [];
    this.nestedTargetKeys = [];
    this.sourceKeyToSourceKeyMap = {};
    this.targetKeyToTargetKeyMap = {};
    this.sourceKeyToFuncMap = {};
    this.targetKeyToFuncMap = {};
    this.sourceElementKeyToFuncMap = {};
    this.targetElementKeyToFuncMap = {};
    this.sourceKeyToNestedMapping = {};
    this.targetKeyToNestedMapping = {};
  }
}
