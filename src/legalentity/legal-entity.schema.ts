import * as mongoose from 'mongoose';

import { LegalEntity } from './legal-entity.interface';

export const LegalEntitySchema = new mongoose.Schema<LegalEntity>(
  {
    name: { type: String, required: true, unique: true },
   
   
  },
  { timestamps: true },
);
