import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type Screen = Readonly<{
  name: string;
  externalCode: string;
  screen_layout: string;
  user_id: string;
  approved_by: string;
  configuration: mongoose.Schema.Types.Mixed;
  uniqueKey: string[];
  type: string;
  nonEditableKey:string[];
}> &
  Document;

export class ScreenDto {
  readonly name!: string;
  code!: string;
  readonly externalCode!: string;
  readonly description!: string;
  readonly user_id!: string;
  readonly screen_layout!: string;
  readonly configuration!: any;
  readonly application_master!: any;
  readonly approved_by!: any;
  readonly uniqueKey!: string[];
  readonly type!: string;
  readonly nonEditableKey!:string[];
}

// export class ScreenDetailsDto {
//   name!: string;
//   configuration!: any;
// }
