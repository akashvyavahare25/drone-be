import * as mongoose from 'mongoose';

import { Job } from './job.interface';

export const JobSchema = new mongoose.Schema<Job>(
  {
    name: { type: String, required: true, unique: true },
    cron_exp: { type: String, required: true },
    type: { type: String, required: true },
    process: { type: mongoose.Schema.Types.Mixed, required: true },
    schema_config: { type: mongoose.Schema.Types.Mixed, required: true },
    model_name: { type: String, required: true, unique: true },

  },
  { timestamps: true },
);
