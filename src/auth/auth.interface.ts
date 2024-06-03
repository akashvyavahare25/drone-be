import {
  IsEmail,
  MinLength,
  MaxLength,
  IsUUID,
  IsNotEmpty,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
//import { ApiModelProperty } from '@nestjs/swagger';

// TODO add mixins like EmailField, PasswordField

export class ActivateParams {
 // @ApiModelProperty({ type: 'ObjectID' })
  @IsNotEmpty()
  readonly userId!: string;

  //@ApiModelProperty({ type: 'uuid' })
  @IsUUID()
  readonly activationToken!: string;
}

export class SignUpDto {
 // @ApiModelProperty({ example: 'email@email.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  readonly email!: string;

 // @ApiModelProperty({ example: 'password', minLength: 4 })
  @MinLength(4)
  readonly password!: string;

 // @ApiModelProperty({ example: '["admin", "user"]'})
  @IsArray()
  @ArrayMinSize(1)
  roles!: string[];
  firstName!: string;
  lastName!: string;
  address!: string;
  phone!: string;
  department!: string;
  designation!: string;
  isPasswordChange!: boolean;
  companyName!:string;
  employeeId!:string;
  masterName!:string;
  column!:string;
  reportingManager!:string;
  appName!:string;
}

export class LoginDto {
 // @ApiModelProperty({ example: 'email@email.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  readonly email!: string;

 // @ApiModelProperty({ example: 'password', minLength: 4 })
  @MinLength(4)
  readonly password!: string;
}

export class ForgottenPasswordDto {
 // @ApiModelProperty({ example: 'email@email.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  readonly email!: string;
}

export class ResetPasswordDto {
 // @ApiModelProperty({ example: 'email@email.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  readonly email!: string;

  //@ApiModelProperty({ type: 'uuid' })
  @IsUUID()
  readonly passwordResetToken!: string;

 // @ApiModelProperty({ example: 'password', minLength: 4 })
  @MinLength(4)
  readonly password!: string;
}
