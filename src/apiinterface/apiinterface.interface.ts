import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Apiinterface = Readonly<{
  name: string;
  interfaceType: string;
  apiinterface_data: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class ApiinterfaceDto {
  readonly name!: string;
  readonly interfaceType!: string;
  readonly apiinterface_data!: mongoose.Schema.Types.Mixed;
}

