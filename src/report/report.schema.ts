import * as mongoose from 'mongoose';

import { Report } from './report.interface';

export const ReportSchema = new mongoose.Schema<Report>(
  {
    name: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    screenData: { type: mongoose.Schema.Types.Mixed, required: true },
    queryType: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed },
    projectFields: { type: mongoose.Schema.Types.Mixed },
    groupFields: { type: mongoose.Schema.Types.Mixed },
    addFields: { type: mongoose.Schema.Types.Mixed },
    lookupFields: { type: mongoose.Schema.Types.Mixed },
    pivotSlice: {type:  mongoose.Schema.Types.Mixed},
  },
  { timestamps: true },
);
