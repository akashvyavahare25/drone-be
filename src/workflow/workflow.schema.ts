import * as mongoose from 'mongoose';

import { Workflow } from './workflow.interface';

export const WorkflowSchema = new mongoose.Schema<Workflow>(
  {
    name: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    targetObject: { type: String, required: true },
    targetType: { type: String, required: true },
    triggerOn: { type: [String], required: true },
    wfType: { type: String, required: true },
    rule: { type: String, required: false },
    steps: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);
