import * as mongoose from 'mongoose';

import { Rules } from './rules.interface';

export const RulesSchema = new mongoose.Schema<Rules>(
  {
    name: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    dataset: { type: String, required: true },
    configuration: { type: mongoose.Schema.Types.Mixed },
    mongoQuery: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);
