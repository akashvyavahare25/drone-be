import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Uploadtemplate = Readonly<{
  name: string;
  format:string;
  delimiter:string;
  Filter:mongoose.Schema.Types.Mixed;
  DropUnusedFields: mongoose.Schema.Types.Mixed;
  Rename: mongoose.Schema.Types.Mixed;
  DefaultVaue: mongoose.Schema.Types.Mixed;
  Transform:mongoose.Schema.Types.Mixed;
  source_path:string,
  target_path:string,
  fileName:string,
  dataset:mongoose.Schema.Types.Mixed,
  source_column:mongoose.Schema.Types.Mixed,
  filterRule:mongoose.Schema.Types.Mixed,
  screen:string,
  lookUp:mongoose.Schema.Types.Mixed,
  mandatory:mongoose.Schema.Types.Mixed,
}> &
  Document;

export class UploadtemplateDto {
  readonly name!: string;
  readonly format!: string;
  readonly delimiter!: string;
  readonly Filter!:mongoose.Schema.Types.Mixed;
  readonly DropUnusedFields!: mongoose.Schema.Types.Mixed;
  readonly Rename!: mongoose.Schema.Types.Mixed;
  readonly DefaultVaue!: mongoose.Schema.Types.Mixed;
  readonly Transform!:mongoose.Schema.Types.Mixed;
  readonly source_path!:string;
  readonly target_path!:string;
  readonly fileName!:string;
  readonly dataset!:mongoose.Schema.Types.Mixed;
  readonly source_column!:mongoose.Schema.Types.Mixed;
  readonly filterRule!:mongoose.Schema.Types.Mixed;
  readonly screen!:string;
  readonly lookUp!:mongoose.Schema.Types.Mixed;
  readonly mandatory!:mongoose.Schema.Types.Mixed;

}
