import { Document } from 'mongoose';
import * as mongoose from 'mongoose';


export type Workflow = Readonly<{
  name: string;
  appName: string;
  targetObject: string;
  targetType: string;
  triggerOn: string[];
  steps: Object[],
  rule: string;
  wfType: string;
}> &
  Document;

export class WorkflowDto {
  readonly name!: string;
  readonly appName!: string;
  readonly targetObject!: string;
  readonly targetType!: string;
  readonly triggerOn!: string[];
  readonly steps!: Object[];
  readonly rule!: string;
  readonly wfType!: string;
}
