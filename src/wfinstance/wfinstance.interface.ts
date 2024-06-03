import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type Wfinstance = Readonly<{
  ownerUserId: string;
  workflowId: string;
  workflowName: string;
  wfRunObject: mongoose.Schema.Types.Mixed;
  // totalSteps: number;
  currentStep: number;
  workflowStatus: string;
  targetObject: string;
  targetType: string;
  companyId:string;
}> &
  Document;

export class WfinstanceDto {
  readonly ownerUserId!: string;
  readonly workflowId!: string;
  readonly workflowName!: string;
  readonly wfRunObject!: mongoose.Schema.Types.Mixed;
  // readonly totalSteps!: number;
  readonly currentStep!: number;
  readonly workflowStatus!: string;
  readonly targetObject!: string;
  readonly targetType!: string;
   companyId!:string;

}

// export class WfinstanceDetailsDto {
//   name!: string;
//   configuration!: any;
// }
