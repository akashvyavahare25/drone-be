import * as mongoose from 'mongoose';

import { Master } from './master.interface';

export const MasterSchema = new mongoose.Schema<Master>(
  {
    name: { type: String, required: true, unique: true },
    configuration: { type: mongoose.Schema.Types.Mixed, required: true },
    code: { type: String, required: false },
    externalCode!: { type: String, required: false },
    status: { type: String, required: false },
    type: { type: String, required: false },
    description: { type: String, required: false },
    version: { type: String, required: false },
    validity_start_date: { type: Date, required: false },
    validity_end_date: { type: Date, required: false },
    labelName: { type: String, required: false },
    uniqueKey: [String],
    approved_by: { type: String, required: false },
  },
  { timestamps: true },
);
