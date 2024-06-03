import * as mongoose from 'mongoose';

import { UserPermission } from './user-permission.interface';

export const UserPermissionSchema = new mongoose.Schema<UserPermission>(
  {
    role: { type: String, required: true  },
    appName: {  type: String, required: true },
    master:{ type: mongoose.Schema.Types.Mixed, required: true },
    appsPermissoin: { type: mongoose.Schema.Types.Mixed, required: true },
    mastersPermissoin: { type: mongoose.Schema.Types.Mixed, required: true },
    configPermission: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
  
).index({'role': 1, 'appName': 1}, {unique: true});;

