import * as mongoose from 'mongoose';

import { Customer } from './customer.interface';

export const CustomerSchema = new mongoose.Schema<Customer>(
  {
    name: { type: String, required: true, unique: true },
   // appName: { type: String, required: true },
    logo: { type:  mongoose.Schema.Types.Mixed, required: true },
    tagLine: { type: String, required: true },
    welcomeMessage: { type: String, required: true },
    entityName: { type: String, required: true },
  },
  { timestamps: true },
);
