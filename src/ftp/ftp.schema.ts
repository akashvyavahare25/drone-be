import * as mongoose from 'mongoose';

import { Ftp } from './ftp.interface';

export const FtpSchema = new mongoose.Schema<Ftp>(
  {
    host: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    ftpLocation: { type: String, required: true },
    filenameRX: { type: String },
  },
  { timestamps: true },
);
