import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Visual = Readonly<{
  name: String;
  type: String;
  graphName: String;
  dataConfig: mongoose.Schema.Types.Mixed;
  report: mongoose.Schema.Types.Mixed;

}> &
  Document;

export class VisualDto {
  readonly name!: string;
  readonly type!: string;
  readonly graphName!: string;
  readonly dataConfig!: mongoose.Schema.Types.Mixed;
  readonly report!: mongoose.Schema.Types.Mixed;
}
