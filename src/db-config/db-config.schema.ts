import * as mongoose from 'mongoose';

import { DbConfig } from './db-config.interface';

export const DbConfigSchema = new mongoose.Schema<DbConfig>(
  {
    name: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    screen: { type: String, required: true, unique: true },
    db: { type: String, required: true },
    host: { type: String, required: true },
    user: { type: String, required: true },
    port: { type: String, required: true },
    password: { type: String, required: true },
    existingTable: { type: Boolean, required: true },
    companyName: { type: String, required: true },
    tableName: { type: String, required: true },
    database: { type: String, required: true },
    // exsitingtableName: { type: String, required: },
    config: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true },
);
