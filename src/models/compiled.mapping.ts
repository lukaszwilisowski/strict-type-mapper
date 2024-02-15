export class CompiledMapping {
  public readonly targetKeys: string[];
  public readonly nestedTargetKeys: string[];
  public readonly sourceKeyToTargetKeyMap: Record<string, string>;
  public readonly targetKeyToSourceKeyMap: Record<string, string>;
  public readonly sourceKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceKeyToNestedMapping: Record<string, CompiledMapping>;
  public readonly targetKeyToNestedMapping: Record<string, CompiledMapping>;

  constructor() {
    this.targetKeys = [];
    this.nestedTargetKeys = [];
    this.sourceKeyToTargetKeyMap = {};
    this.targetKeyToSourceKeyMap = {};
    this.sourceKeyToFuncMap = {};
    this.targetKeyToFuncMap = {};
    this.sourceElementKeyToFuncMap = {};
    this.targetElementKeyToFuncMap = {};
    this.sourceKeyToNestedMapping = {};
    this.targetKeyToNestedMapping = {};
  }
}
