import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type Hierarchy = Readonly<{
  name: string;
  masterName: string;
  hierarchy_data: mongoose.Schema.Types.Mixed;
}> &
  Document;

export class HierarchyDto {
  readonly name!: string;
  readonly masterName!: string;
  readonly hierarchy_data!: mongoose.Schema.Types.Mixed;
}

