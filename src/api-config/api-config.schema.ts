import * as mongoose from 'mongoose';
import { ApiConfig } from './api-config.interface';



export const ApiConfigSchema = new mongoose.Schema<ApiConfig>(
  {
    interfaceName: { type: String, required: true, unique: true },
    appName: { type: String, required: true },
    screen: { type: String, required: true, unique: true },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    url:{type:String,required:true}
  },
  { timestamps: true },
);