import * as mongoose from 'mongoose';

import { TDynaSchema } from './dynaschema.interface';

export const DynaSchemaSchema = new mongoose.Schema<TDynaSchema>(
  {
    model_name: { type: String, required: true, unique: true },
    form_config: { type: mongoose.Schema.Types.Mixed, required: true },
    schema_config: { type: mongoose.Schema.Types.Mixed, required: true },
    uniqueKey: { type: Array, required: true },
    uniqueConfig:{ type: mongoose.Schema.Types.Mixed}
  },
  { timestamps: true },
);
