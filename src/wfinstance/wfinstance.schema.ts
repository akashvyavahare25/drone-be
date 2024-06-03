import * as mongoose from 'mongoose';

import { Wfinstance } from './wfinstance.interface';

export const WfinstanceSchema = new mongoose.Schema<Wfinstance>(
  {
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    workflowId: { type: String, required: false },
    workflowName: { type: String, required: false },
    wfRunObject: { type: mongoose.Schema.Types.Mixed, required: true },
    // totalSteps: { type: Number, required: false },
    currentStep: { type: Number, required: true },
    workflowStatus: { type: String, required: false },
    targetObject: { type: String, required: true },
    targetType: { type: String, required: true },
    companyId:{type: String},
  },
  { timestamps: true },
);
