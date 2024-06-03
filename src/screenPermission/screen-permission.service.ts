import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { ScreenPermissionDto, ScreenPermission } from './screen-permission.interface';

@Injectable()
export class ScreenPermissionService {

  constructor(
    @InjectModel('ScreenPermission') private readonly screenPermissionaModel: Model<ScreenPermission>,
  ) { }

  async create(appMaster: ScreenPermissionDto): Promise<ScreenPermission> {
    try {
      return this.screenPermissionaModel.create(appMaster);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, ScreenPermission: ScreenPermissionDto): Promise<any> {
    try {
      return this.screenPermissionaModel.update({ _id: id }, ScreenPermission);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<ScreenPermission> {
    const appMaster = await this.screenPermissionaModel.findById(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }
  async getByNameAndRoleName(code:string,role: string): Promise<any> {
    const appMaster = await this.screenPermissionaModel.find({
      roleName:role,
      name:code
    });
    // if (!appMaster) {
    //   throw Exception();
    // }
    return appMaster;
  }
  async deleteById(id: string): Promise<ScreenPermission> {
    const appMaster = await this.screenPermissionaModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }
  
  async findByCode(id): Promise<ScreenPermission> {
    try {
      return this.screenPermissionaModel.findOne({name:id});
    } catch {
      throw Exception();
    }
  }

  async getAll(): Promise<ScreenPermission[]> {
    try {
      return this.screenPermissionaModel.find();
    } catch {
      throw Exception();
    }
  }

}
