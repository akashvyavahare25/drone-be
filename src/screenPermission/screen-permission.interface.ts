import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type ScreenPermission = Readonly<{
  name: string;
  roleName: string;
 config: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class ScreenPermissionDto {
  readonly name!: string;
  readonly roleName!: string;
  readonly config!: mongoose.Schema.Types.Mixed;
}

// export class AppMasterDetailsDto {
//   name!: string;
//   configuration!: any;
// }
