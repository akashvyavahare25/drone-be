import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Report = Readonly<{
  name: string;
  appName: String;
  screenData: mongoose.Schema.Types.Mixed;
  queryType: String;
  config: mongoose.Schema.Types.Mixed;
  projectFields: mongoose.Schema.Types.Mixed;
  groupFields: mongoose.Schema.Types.Mixed;
  addFields: mongoose.Schema.Types.Mixed;
  lookupFields: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class ReportDto {
  readonly name!: string;
  readonly appName!: string;
  readonly screenData!: mongoose.Schema.Types.Mixed;
  readonly queryType!: string;
  readonly config!: mongoose.Schema.Types.Mixed;
  readonly projectFields!: mongoose.Schema.Types.Mixed;
  readonly groupFields!: mongoose.Schema.Types.Mixed;
  readonly addFields!: mongoose.Schema.Types.Mixed;
  readonly lookupFields!: mongoose.Schema.Types.Mixed;
  readonly pivotSlice!: mongoose.Schema.Types.Mixed
}
