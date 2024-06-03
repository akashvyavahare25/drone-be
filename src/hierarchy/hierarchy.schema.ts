import * as mongoose from 'mongoose';

import { Hierarchy } from './hierarchy.interface';

export const HierarchySchema = new mongoose.Schema<Hierarchy>(
  {
    name: { type: String, required: true, unique: true },
    masterName: { type: String, required: false },
    hierarchy_data: { type: mongoose.Schema.Types.Mixed, required: true }

  },
  { timestamps: true },
);
