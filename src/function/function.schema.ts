import * as mongoose from 'mongoose';

import { Function } from './function.interface';

export const FunctionSchema = new mongoose.Schema<Function>(
  {
    name: { type: String, required: true, unique: true },
    in_argument: { type: mongoose.Schema.Types.Mixed, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true },
);
