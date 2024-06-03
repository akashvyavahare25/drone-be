import * as mongoose from 'mongoose';

import { RoleManagement } from './role-management.interface';

export const RoleManagementSchema = new mongoose.Schema<RoleManagement>(
  {
    name: { type: String, required: true, unique: true },
   // status: { type: String, required: false },
   appName: { type: String, required: false },
  },
  { timestamps: true },
);
