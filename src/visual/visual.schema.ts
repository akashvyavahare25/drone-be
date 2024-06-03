import * as mongoose from 'mongoose';

import { Visual } from './visual.interface';

export const VisualSchema = new mongoose.Schema<Visual>(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    graphName: { type: String, required: true },
    dataConfig: { type: mongoose.Schema.Types.Mixed },
    report: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);
