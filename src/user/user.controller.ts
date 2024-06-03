import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  UseGuards,
  Delete,
  Body,UseInterceptors, UploadedFiles, Res
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
var fs = require('fs');
const multer = require('multer');

import {
  ActivateParams, SignUpDto,
} from '../auth/auth.interface';
import { getOriginHeader } from '../common/auth';
//import { ApiUseTags } from '@nestjs/swagger';
import { User, UserDto, UserAddDto, RoleIdCollection } from '../user/user.interface';
import { Console } from 'console';
import { UserService } from './user.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express'
import { LoggingInterceptor } from '../common/interceptor';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

 @Post('add-new-user')
  async addUser(@Req() req: Request) {
    const user = await this.userService.create(
      req.body.email,
      req.body.password,
      req.body.roles,
      getOriginHeader(req),
      req.body.firstName,
      req.body.lastName,
      req.body.address,
      req.body.phone,
      req.body.designation,
      req.body.department,
      req.body.companyName,
      req.body.employeeId,
      req.body.masterName,
      req.body.column,
      req.body.reportingManager,
      req.body.appName
    );
    return {
      user: user.getPublicData(),
    };
  }

  @Put('update-user/:userId')
  async updateUser(@Param('userId') userId: string, @Req() req: Request, @Body() userDto: any) {

    return this.userService.updateUser(userId, req.body);
  }
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: any, @Req() req: Request, @Res() res: any) {
    try {
      if (files == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      }
      let reportData: any;
      await this.userService.uploadfile(files, req).then((resp: any) => {
        reportData = resp;
      });
      res.status(200).json({
        status: 200,
        reportData: reportData,
        message:
          "Uploaded the file successfully: " + files[0].originalname,
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: error + "Could not upload the file: " + files[0].originalname,
      });
    }
  }

  @Get('fetch-user/:userId')
  async fetchUser(@Param('userId') userId: string) {
    return await this.userService.findById(userId);
  }

  @Post('fetch-user-by-role')
  async fetchUserByRole(@Req() req: Request, @Body() role: any) {
    return await this.userService.findByRole(role.roles);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<User> {
    return await this.userService.deleteById(userId);
  }
  @Get('fetch-users')
  fetchUsers(@Req() req: Request) {
    return this.userService.findAll();
  }

  @Get('userrolelist/:roleName')
  RoleIdUsers(@Param('roleName') roleName: string) {
    return this.userService.findRoleIdUser(roleName);
  }

  @Delete('userrole/:roleName')
  async deleteUserRole(@Param('roleName') roleName: string): Promise<RoleIdCollection> {
    return await this.userService.deleteByUserRole(roleName);
  }
}
