import * as mongoose from 'mongoose';

import { Uploadtemplate } from './uploadtemplate.interface';

export const UploadtemplateSchema = new mongoose.Schema<Uploadtemplate>(
  {
    name: { type: String, required: true, unique: true },
    format: { type: String, required: true},
    delimiter: { type: String, required: true},
    Filter: { type: mongoose.Schema.Types.Mixed },
    DropUnusedFields: { type: mongoose.Schema.Types.Mixed },
    Rename: { type: mongoose.Schema.Types.Mixed },
    DefaultVaue: { type: mongoose.Schema.Types.Mixed },
    Transform: { type: mongoose.Schema.Types.Mixed },
    source_path:{ type: String},
    target_path:{ type: String},
    fileName:{ type: String},
    dataset:{ type: mongoose.Schema.Types.Mixed },
    source_column:{ type: mongoose.Schema.Types.Mixed },
    filterRule: { type: mongoose.Schema.Types.Mixed },
    screen:{ type: String},
    lookUp:{ type: mongoose.Schema.Types.Mixed },
    mandatory:{ type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);
