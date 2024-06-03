import * as mongoose from 'mongoose';

import { TriggerScreenJob } from './trigger-screen-job.interface';

export const TriggerScreenJobSchema = new mongoose.Schema<TriggerScreenJob>(
  {
    screen: { type: String, required: true, unique: true },
    startDate: { type: mongoose.Schema.Types.Mixed },
    endDate: { type: String},
    frequencyPaySchedule: { type: String},
    fixedPaySchedule: { type: mongoose.Schema.Types.Mixed },
    type:{ type: String},
  },
  { timestamps: true },
);
