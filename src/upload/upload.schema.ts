import * as mongoose from 'mongoose';

import { Upload } from './upload.interface';

export const UploadSchema = new mongoose.Schema<Upload>(
  {
    name: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    screenName: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed },
    uploadParameter: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);
