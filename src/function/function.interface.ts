import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Function = Readonly<{
  name: string;
  in_argument: mongoose.Schema.Types.Mixed;
  body: string;
}> &
  Document;

export class FunctionDto {
  readonly name!: string;
  readonly in_argument!: mongoose.Schema.Types.Mixed;
  readonly body!: string;
}

// export class FunctionDetailsDto {
//   name!: string;
//   configuration!: any;
// }
