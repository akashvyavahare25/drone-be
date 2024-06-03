import * as mongoose from 'mongoose';

import { Public } from './public.interface';

export const PublicSchema = new mongoose.Schema<Public>(
  {
    name: { type: String, required: true, unique: true },
    cron_exp: { type: String, required: true },
    type: { type: String, required: true },
    process: { type: mongoose.Schema.Types.Mixed, required: true },
    schema_config: { type: mongoose.Schema.Types.Mixed, required: true },
    model_name: { type: String, required: true, unique: true },

  },
  { timestamps: true },
);
