import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { RoleManagementDto, RoleManagement } from './role-management.interface';
import { AppMasterService } from 'src/appmaster/app-master.service';

@Injectable()
export class RoleManagementService {

  constructor(
    @InjectModel('RoleManagement') private readonly appMasterModel: Model<RoleManagement>,
    private appmasterservice: AppMasterService
  ) { }

  async create(appMaster: RoleManagementDto): Promise<RoleManagement> {
    try {
      return this.appMasterModel.create(appMaster);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, RoleManagement: RoleManagementDto): Promise<any> {
    try {
      return this.appMasterModel.update({ _id: id }, RoleManagement);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<RoleManagement> {
    const appMaster = await this.appMasterModel.findById(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async deleteById(id: string): Promise<RoleManagement> {
    const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async findByAppId(id): Promise<RoleManagement[]> {
    try {
      return this.appMasterModel.find({ appName: id });
    } catch {
      throw Exception();
    }
  }

  async getAll(): Promise<RoleManagement[]> {
    try {
      return await this.appMasterModel.aggregate([
        {
          $addFields: {
            appName: { "$toObjectId": "$appName" }
          }
        },
        {
          $lookup:
          {
            from: "appmasters",
            localField: "appName",
            foreignField: "_id",
            as: "appName"
          }
        },
      ]);
    } catch {
      throw Exception();
    }
  }

}
