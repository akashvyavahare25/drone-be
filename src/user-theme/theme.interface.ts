import { Document } from 'mongoose';
//import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength, ArrayMinSize, IsArray, IsString, IsBoolean } from 'class-validator';

export type Theme = Readonly<{
  id: string;
  color: string;
  name: string;
  companyName:string;
  employeeId:string;


}>;


