import * as mongoose from 'mongoose';

import { Parameter, ParameterCollection } from './parameter.interface';

export const ParameterSchema = new mongoose.Schema<Parameter>(
  {
    name: { type: String, required: true },
    configuration: { type: mongoose.Schema.Types.Mixed, required: true },
    code: { type: String, required: true },
    externalCode: { type: String, required: true },
    uniqueKey: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: [String], required: true },
    approved_by: { type: String, required: false },
  },
  { timestamps: true },
);

export const ParameterCollectionSchema = new mongoose.Schema<ParameterCollection>(
  {
    parameterCode: { type: String, required: true },
    masterScreenId: { type: String, required: true },
    masterScreenName: { type: String, required: true },
    masterScreenCode: { type: String, required: true },
    masterScreenType: { type: String, required: true },
  },
  { timestamps: true },
);
