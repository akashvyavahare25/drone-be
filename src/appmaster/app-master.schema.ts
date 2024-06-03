import * as mongoose from 'mongoose';

import { AppMaster } from './app-master.interface';

export const AppMasterSchema = new mongoose.Schema<AppMaster>(
  {
    name: { type: String, required: true, unique: true },
    status: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true },
);
