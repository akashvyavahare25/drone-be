import * as mongoose from 'mongoose';

import { Screen } from './screen.interface';

export const ScreenSchema = new mongoose.Schema<Screen>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: false },
    externalCode!: { type: String, required: false },
    description: { type: String, required: false },
    configuration: { type: mongoose.Schema.Types.Mixed, required: true },
    screen_layout: { type: String, required: true },
    application_master: { type: String, required: true },
    approved_by: { type: String, required: false },
    uniqueKey: [String],
    type: { type: String, required: false },
    nonEditableKey:[String]
  },
  { timestamps: true },
);
