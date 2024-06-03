import * as mongoose from 'mongoose';

import { ScreenPermission } from './screen-permission.interface';

export const ScreenPermissionSchema = new mongoose.Schema<ScreenPermission>(
  {
    name: { type: String, required: true },
    roleName: { type: String, required: true },
   config: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
).index({'name': 1, 'roleName': 1}, {unique: true});;
