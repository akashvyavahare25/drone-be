import { Document } from 'mongoose';
//import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength, ArrayMinSize, IsArray, IsString, IsBoolean } from 'class-validator';

export type UserPublicData = Readonly<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  roles: string[];
  phone: string;
  department: string;
  designation: string;
  isActive: boolean;
  companyName:string;
  employeeId:string;
  column:string;
  appName:string[];
  reportingManager:string

}>;

export interface UserMethods {
  getPublicData: () => UserPublicData;
}

export type User = Readonly<{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  department: string,
  designation: string,
  passwordResetToken: string;
  passwordResetExpires: number;
  isActive: boolean;
  activationExpires: string;
  activationToken: string;
  roles: string[];
  companyName:string;
  masterName:string;
  employeeId:string;
  column:string
  reportingManager:string
  appName:string[]
}> &
  UserMethods &
  Document;

export class UserDto {

//@ApiModelProperty({ example: 'password' })
  @IsString()
  password!: string;

  //@ApiModelProperty({ example: '["admin", "user"]' })
  @IsArray()
  @ArrayMinSize(1)
  roles!: string[];

  //@ApiModelProperty({ example: 'firstName' })
  @IsString()
  firstName!: string;

  //@ApiModelProperty({ example: 'lastName' })
  @IsString()
  lastName!: string;

  //@ApiModelProperty({ example: 'address' })
 // @IsString()
  address!: string;

  //@ApiModelProperty({ example: 'phone' })
 // @IsString()
  phone!: string;

  //@ApiModelProperty({ example: 'designation' })
  // @IsString()
   designation!: string;

  // //@ApiModelProperty({ example: 'department' })
 //  @IsString()
  department!: string;

  ///@ApiModelProperty({ example: 'isPasswordChange' })
  @IsBoolean()
  isPasswordChange!: boolean;

  // @ApiModelProperty({ example: 'companyName' })
 // @IsString()
  companyName!: string;

  
  employeeId!:number;

  @IsString()
  masterName!:string;


  @IsString()
  column!:string;

  @IsString()
  reportingManager!:string;

  @IsArray()
  @ArrayMinSize(1)
  appName!:string[];

}

export class UserAddDto {
//@ApiModelProperty({ example: 'email@email.com', maxLength: 255 })
  @MaxLength(255)
  readonly email!: string;

  //@ApiModelProperty({ example: 'password', minLength: 4 })
  @MinLength(4)
  password!: string;

  //@ApiModelProperty({ example: '["admin", "user"]' })
  @IsArray()
  @ArrayMinSize(1)
  roles!: string[];

  //@ApiModelProperty({ example: 'firstName' })
  @MinLength(1)
  firstName!: string;

  //@ApiModelProperty({ example: 'lastName' })
  @MinLength(1)
  lastName!: string;

  //@ApiModelProperty({ example: 'address' })
  //@MinLength(1)
  address!: string;

  // @ApiModelProperty({ example: 'phone' })
 // @MinLength(1)
  phone!: string;

  //@ApiModelProperty({ example: 'designation' })
  // @MinLength(1)
  designation!: string;

  // //@ApiModelProperty({ example: 'department' })
 // @MinLength(1)
  department!: string;

  //@ApiModelProperty({ example: 'isPasswordChange' })
  isPasswordChange!: boolean;

  //@ApiModelProperty({ example: 'companyName' })
 // @IsString()
  companyName!: string;
 // @IsString()
  masterName!:string;
  
 
  employeeId!:string;

  @IsString()
  column!:string;

  @IsString()
  reportingManager!:string;

  @IsArray()
  @ArrayMinSize(1)
  appName!:string[];
}

export type RoleIdCollection = Readonly<{
  userId: String;
  roleName: String;
}> &
  Document;