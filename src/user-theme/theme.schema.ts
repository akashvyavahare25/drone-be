import * as mongoose from 'mongoose';

import {Theme } from './theme.interface';

export const ThemeSchema = new mongoose.Schema<Theme>(
  {
    color: { type: String, required: true, unique: false },
    name: { type: String, required: true, unique: false  },
    companyName:{ type: String, required: false },
    employeeId:{ type: String, required: true, unique: true},
  }, 
  { timestamps: true },
);
