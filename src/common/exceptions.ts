import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  MethodNotAllowedException,
  HttpException,
  HttpStatus,
  NotAcceptableException
} from '@nestjs/common';
import { MongoError } from 'mongodb'

export const EmailAlreadyUsedException = () =>
  new ConflictException('Email already in use.');

export const Exception = () =>
  new ConflictException('Exception ....');

export const CustomException = (error: any) => {
  if (error instanceof MongoError) {
    return new HttpException({
      status: '1005',
      error: error.errmsg,
    }, HttpStatus.NOT_ACCEPTABLE);
  } else if (error.name == 'MongooseError') {
    return new HttpException({
      status: '1006',
      error: error.message,
    }, HttpStatus.NOT_ACCEPTABLE);
  } else {
    return new ConflictException('Exception ....');
  }
}

export const UserNotFoundException = () =>
  new NotFoundException('Requested user does not exist.');

export const IdNotFoundException = () =>
  new NotFoundException('Invalid Id.');
  export const SessionTimeOutException = () =>
  new ForbiddenException('Your session is invalid or has Expired'); 
export const ActivationTokenInvalidException = () =>
  new ForbiddenException('Activation token is invalid or has expired.');

export const PasswordResetTokenInvalidException = () =>
  new ForbiddenException('Password reset token is invalid or has expired.');

export const LoginCredentialsException = () =>
  new UnauthorizedException('Password not matched.');

export const CollectionAlreadyExistsException = () =>
  new ConflictException('Collection already exists.');
  
export const FileSchedularAlreadyExistsException = () =>
  new ConflictException('FileSchedular already exists.');

export const UserCannotBeUpdate = () =>
  new ConflictException('User Can not be Update.');

export const CustomerDeactivated = () =>
  new ForbiddenException("You Don't have  Permission to Login.");

export const UserExpired = () =>
  new ForbiddenException('Your account has expired.');

export const UserDeactivated = () =>
  new ForbiddenException('Your Account is Deactivated.');
  export const DuplicateData = () =>
  new NotAcceptableException("Duplicate Record,Data Already Exists.");
