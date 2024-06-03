import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import {
  ActivateParams,
  ForgottenPasswordDto,
  ResetPasswordDto,
  SignUpDto,
  LoginDto,
} from './auth.interface';
import { AuthService } from './auth.service';
import { getOriginHeader } from '../common/auth';
//import { ApiUseTags } from '@nestjs/swagger';
import { User } from '../user/user.interface';
import { Console } from 'console';
import { of } from 'rxjs';
import { join } from 'path';
//@ApiUseTags('auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('activate/:userId/:activationToken')
  activate(@Param() params: ActivateParams, @Param('userId') userId: string) {
    return this.authService.activate(params);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request, @Body() loginDto: LoginDto) {
    // TODO: remove loginDto, swagger should find it somehow by exploring the AuthGuard
   
    return this.authService.login(req.user as User);
  }
  
  @Get('logo/:imageName')
  async getlogo(@Param('imageName') imageName:any,@Res() res:any): Promise<any> {
    console.log("hiiiiiiiiiiiiiiiiiii",join(process.cwd(),'/logo_images/'+imageName))
    return of(res.sendFile(join(process.cwd(),'/logo_images/'+imageName)))
  }
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto, @Req() req: Request) {
    return this.authService.signUpUser(req.body, getOriginHeader(req));
  }

  @UseGuards(AuthGuard())
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post('add-user')
  async addUser(@Body() signUpDto: SignUpDto, @Req() req: Request) {
    return this.authService.addUser(req.body, getOriginHeader(req));
  }

  @UseGuards(AuthGuard())
  @Get('relogin')
  relogin(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('forgotten-password')
  forgottenPassword(@Body() body: ForgottenPasswordDto, @Req() req: Request) {
    return this.authService.forgottenPassword(body, getOriginHeader(req));
  }
  @Post('verify-token')
  verfyjwttoken(@Body() body: any){
    return this.authService.verifyJwtToken(body)
  }

  @Post('reset-password')
  resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }
}
