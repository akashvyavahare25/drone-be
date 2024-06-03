import { Document } from 'mongoose';
import * as mongoose from 'mongoose';


export type Dashboard = Readonly<{
  name: string;
  appName:string;
  data: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class DashboardDto {
  readonly name!: string;
  appName!:string;
  readonly data!: mongoose.Schema.Types.Mixed;
}
