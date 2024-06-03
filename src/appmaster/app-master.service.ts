import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { AppMasterDto, AppMaster } from './app-master.interface';
import { UserPermissionService } from 'src/userpermission/user-permission.service';

@Injectable()
export class AppMasterService {

  constructor(
    @InjectModel('AppMaster') private readonly appMasterModel: Model<AppMaster>,
    private userPermissionService:UserPermissionService
  ) { }

  async create(appMaster: AppMasterDto): Promise<AppMaster> {
    try {
      return this.appMasterModel.create(appMaster);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, AppMaster: AppMasterDto): Promise<any> {
    try {
      return this.appMasterModel.update({ _id: id }, AppMaster);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<AppMaster> {
    const appMaster = await this.appMasterModel.findById(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }
  async findByName(appName: string): Promise<AppMaster> {
    const appMaster = await this.appMasterModel.findOne({name:appName});
    
    return appMaster._id;
  }

  async deleteById(id: string): Promise<any> {
   const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    await this.userPermissionService.findAndDelete(id,'appMaster') 
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async getAll(): Promise<AppMaster[]> {
    try {
      return this.appMasterModel.find();
    } catch {
      throw Exception();
    }
  }

  async getAllMenu():Promise<AppMaster[]>{
    try {
      return this.appMasterModel.find({}).select('_id name');
    } catch {
      throw Exception();
    }
  }

}
