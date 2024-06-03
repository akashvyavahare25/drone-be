import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Master = Readonly<{
  name: string;
  code: string;
  externalCode: string;
  status: string;
  type: string;
  description: string;
  version: string;
  user_id: string;
  validity_start_date: Date;
  validity_end_date: Date;
  configuration: mongoose.Schema.Types.Mixed;
  labelName: string;
  uniqueKey: string[];
  approved_by: string;
}> &
  Document;

export class MasterDto {
  readonly name!: string;
  public code!: string;
  readonly externalCode!: string;
  readonly status!: string;
  readonly type!: string;
  readonly description!: string;
  readonly version!: string;
  readonly validityStartDate!: Date;
  readonly validityEndDate!: Date;
  readonly configuration!: any;
  readonly user_id!: string;
  readonly labelName!: string;
  readonly uniqueKey!: string[];
  readonly approved_by!: string;
}

export class MasterDetailsDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  configuration!: any;
}
