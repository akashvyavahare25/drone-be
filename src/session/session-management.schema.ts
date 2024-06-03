import * as mongoose from 'mongoose';

import { SessionManagement } from './session-management.interface';

export const SessionManagementSchema = new mongoose.Schema<SessionManagement>(
  {
    userId: { type: String, required: true, unique: true },
   // status: { type: String, required: false },
  // appName: { type: String, required: false },
  },
  { timestamps: true },
);
