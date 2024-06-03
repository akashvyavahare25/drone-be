import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { LegalEntityDto, LegalEntity } from './legal-entity.interface';

@Injectable()
export class LegalEntityService {

  constructor(
    @InjectModel('LegalEntity') private readonly appMasterModel: Model<LegalEntity>,
  ) { }

  async create(appMaster: LegalEntityDto): Promise<LegalEntity> {
    try {
      return this.appMasterModel.create(appMaster);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, LegalEntity: LegalEntityDto): Promise<any> {
    try {
      return this.appMasterModel.update({ _id: id }, LegalEntity);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<LegalEntity> {
    const appMaster = await this.appMasterModel.findById(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async deleteById(id: string): Promise<LegalEntity> {
    const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async getAll(): Promise<LegalEntity[]> {
    try {
      return this.appMasterModel.find();
    } catch {
      throw Exception();
    }
  }

}
