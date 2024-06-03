import { Controller, Get, Post, Req, Param, UseGuards, Body, ValidationPipe, Delete, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggingInterceptor } from '../common/interceptor';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Notification, NotificationDto } from './notification.interface';
import { NotificationService } from './notification.service';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('api/notification')
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  async create(@Req() req: Request, @Body() notificationDto: NotificationDto): Promise<Notification> {
    return this.notificationService.create(req.body);
  }

  @Get()
  async getAll(): Promise<Notification[]> {
    return this.notificationService.getAll();
  }

  @Get('/no-action')
  async noActionGetAllNotification(@Req() req: Request): Promise<Notification[]> {
    return this.notificationService.noActionGetAllNotification(req.user);
  }

  @Get('/history-by-wfinstance/:WfinstanceId')
  async getHistoryOfWfinstance(@Param('WfinstanceId') wfinstanceId: string, @Req() req: Request): Promise<Notification[]> {
    return this.notificationService.getHistoryOfWfinstance(wfinstanceId);
  }

  @Get('/history-by-wfinstance/:WfinstanceId/nf-id/:NfId')
  async getHistoryOfWfinstanceWithCheckOfSameUserNf(@Param('WfinstanceId') wfinstanceId: string, @Param('NfId') nfId: string, @Req() req: Request): Promise<Notification[]> {
    return this.notificationService.getHistoryOfWfinstanceWithCheckOfSameUserNf(wfinstanceId, nfId, req.user);
  }

  @Get(':NotificationId')
  async getOne(@Param('NotificationId') notificationId: string): Promise<Notification> {
    return this.notificationService.findById(notificationId);
  }

  @Delete(':NotificationId')
  async delete(@Param('NotificationId') notificationId: string): Promise<Notification> {
    return this.notificationService.deleteById(notificationId);
  }

  @Put(':NotificationId')
  async update(@Param('NotificationId') notificationId: string, @Req() req: Request): Promise<Notification> {
    return this.notificationService.update(notificationId, req.body);
  }

  @Put('finsih-reject-status/:NotificationId')
  async updateFinishRejectStatus(@Param('NotificationId') notificationId: string): Promise<Notification> {
    return this.notificationService.updateFinishRejectStatus(notificationId);
  }
}