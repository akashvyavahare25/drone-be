import * as mongoose from 'mongoose';

import { Apiinterface } from './apiinterface.interface';

export const ApiinterfaceSchema = new mongoose.Schema<Apiinterface>(
  {
    name: { type: String, required: true, unique: true },
    interfaceType: { type: String, required: false },
    apiinterface_data: { type: mongoose.Schema.Types.Mixed, required: true }

  },
  { timestamps: true },
);
