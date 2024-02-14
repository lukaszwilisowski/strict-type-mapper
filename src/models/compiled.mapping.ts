export class CompiledMapping {
  public readonly sourceKeys: string[];
  public readonly nestedSourceKeys: string[];
  public readonly targetKeyToSourceKeyMap: Record<string, string>;
  public readonly sourceKeyToTargetKeyMap: Record<string, string>;
  public readonly targetKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly sourceElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly targetKeyToNestedMapping: Record<string, CompiledMapping>;
  public readonly sourceKeyToNestedMapping: Record<string, CompiledMapping>;

  constructor() {
    this.sourceKeys = [];
    this.nestedSourceKeys = [];
    this.targetKeyToSourceKeyMap = {};
    this.sourceKeyToTargetKeyMap = {};
    this.targetKeyToFuncMap = {};
    this.sourceKeyToFuncMap = {};
    this.targetElementKeyToFuncMap = {};
    this.sourceElementKeyToFuncMap = {};
    this.targetKeyToNestedMapping = {};
    this.sourceKeyToNestedMapping = {};
  }
}
