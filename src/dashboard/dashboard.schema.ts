import * as mongoose from 'mongoose';

import { Dashboard } from './dashboard.interface';

export const DashboardSchema = new mongoose.Schema<Dashboard>(
  {
    name: { type: String, required: true, unique: true },
    appName: { type: String, required: true},
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true },
);
