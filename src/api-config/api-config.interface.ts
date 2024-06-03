import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type ApiConfig = Readonly<{
  interfaceName: string;
  appName:string;
  screen:string;
  url:string;
  config: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class ApiConfigDto {
  readonly interfaceName!: string;
  readonly appName!: string;
  readonly url!:string
  readonly screen!: string;
}

