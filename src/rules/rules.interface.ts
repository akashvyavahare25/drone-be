import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Rules = Readonly<{
  name: string;
  appName: String;
  dataset: string;
  configuration: mongoose.Schema.Types.Mixed;
  mongoQuery: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class RulesDto {
  readonly name!: string;
  readonly appName!: string;
  readonly dataset!: string;
  readonly configuration!: mongoose.Schema.Types.Mixed;
  readonly mongoQuery!: mongoose.Schema.Types.Mixed;
}
