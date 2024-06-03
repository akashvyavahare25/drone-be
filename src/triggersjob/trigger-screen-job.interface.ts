import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type TriggerScreenJob = Readonly<{
  screen: String;
  startDate: mongoose.Schema.Types.Mixed;
  endDate: String;
  frequencyPaySchedule: String;
  fixedPaySchedule: mongoose.Schema.Types.Mixed;
  type:String;
}> &
  Document;

export class TriggerScreenJobDto {
  readonly screen!: String;
  readonly startDate!: mongoose.Schema.Types.Mixed;;
  readonly endDate!: String;
  readonly frequencyPaySchedule!: String;
  readonly fixedPaySchedule!: mongoose.Schema.Types.Mixed;;
  readonly type!:String;
}
