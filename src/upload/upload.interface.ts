import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Upload = Readonly<{
  name: string;
  appName: String;
  screenName: String;
  config: mongoose.Schema.Types.Mixed;
  uploadParameter: mongoose.Schema.Types.Mixed;

}> &
  Document;

export class UploadDto {
  readonly name!: string;
  readonly appName!: string;
  readonly screenName!: string;
  readonly config!: mongoose.Schema.Types.Mixed;
  readonly uploadParameter!: mongoose.Schema.Types.Mixed;
}
