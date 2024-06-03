import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Parameter = Readonly<{
  name: string;
  code: string;
  externalCode: string;
  uniqueKey: string;
  status: string;
  type: string;
  user_id: string;
  category: [string];
  approved_by: string;
  configuration: mongoose.Schema.Types.Mixed;
}> &
  Document;

export type ParameterCollection = Readonly<{
  parameterCode: String;
  masterScreenId: String;
  masterScreenName: String;
  masterScreenCode: String;
  masterScreenType: String;
}> &
  Document;

export class ParameterDto {
  @IsNotEmpty()
  readonly name!: string;
  // @IsNotEmpty()
  // readonly user_id!: string;
  code!: string;
  @IsNotEmpty()
  readonly externalCode!: string;
  uniqueKey!: string;
  @IsNotEmpty()
  readonly status!: string;
  @IsNotEmpty()
  readonly type!: string;
  // @IsNotEmpty()
  // readonly approved_by!: string;
  @IsNotEmpty()
  readonly category!: [string];
  @IsNotEmpty()
  readonly configuration!: any;
}
