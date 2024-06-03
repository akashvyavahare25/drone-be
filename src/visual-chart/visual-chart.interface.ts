import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type VisualChart = Readonly<{
  name: string;
  x: string;
  y: string;
  type:string;
  color:string;
  subtype:string;
  config:mongoose.Schema.Types.Mixed;
  report:mongoose.Schema.Types.Mixed;
}> &
  Document;

export class VisualChartDto {
  readonly name!: string;
  readonly x!: string;
  readonly y!: string;
  readonly type!: string;
  readonly color!: string;
  readonly subtype!:string;
  readonly config!:  mongoose.Schema.Types.Mixed;
  readonly report!:  mongoose.Schema.Types.Mixed;
}

// export class VisualChartDetailsDto {
//   name!: string;
//   configuration!: any;
// }
