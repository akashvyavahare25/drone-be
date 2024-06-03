import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { ApiinterfaceDto, Apiinterface } from './apiinterface.interface';
import { createUUID } from '../common/helpers';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';
import { ParameterService } from '../parameter/parameter.service';
import * as _ from 'lodash'
import { method } from 'lodash';
import fetch from 'node-fetch';


@Injectable()
export class ApiinterfaceService {

  constructor(
    @InjectModel('Apiinterface') private readonly apiinterfaceModel: Model<Apiinterface>) { }

  async create(apiinterface: ApiinterfaceDto): Promise<Apiinterface> {
    try {
      const apiinterfaceData: any = await this.apiinterfaceModel.create(apiinterface);
      return apiinterfaceData;

    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, apiinterface: ApiinterfaceDto): Promise<Apiinterface> {
    try {
      const apiinterfaceData: any = await this.apiinterfaceModel.update({ _id: id }, apiinterface);
      return apiinterfaceData
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Apiinterface> {
    try {
      const apiinterface = await this.apiinterfaceModel.findById(id);
      if (!apiinterface) {
        throw Exception();
      }
      return apiinterface;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByName(name: string): Promise<Apiinterface> {
    try {
      const apiinterface = await this.apiinterfaceModel.findOne({ name: name })
      if (!apiinterface) {
        throw Exception();
      }
      return apiinterface;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Apiinterface> {
    try {
      const apiinterface: any = await this.apiinterfaceModel.findByIdAndDelete(id);
      return apiinterface;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Apiinterface[]> {
    try {
      return await this.apiinterfaceModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCodeAndId(apiinterfaceCode: string, id: String): Promise<Apiinterface> {
    try {
      const apiinterface = await this.apiinterfaceModel.findOne({ code: apiinterfaceCode, _id: id });
      if (!apiinterface) {
        throw Exception();
      }
      return apiinterface;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCode(apiinterfaceCode: string): Promise<Apiinterface> {
    try {
      const apiinterface = await this.apiinterfaceModel.findOne({ code: apiinterfaceCode });
      if (!apiinterface) {
        throw Exception();
      }
      return apiinterface;
    } catch (e) {
      throw CustomException(e);
    }
  }



  async getRes(option: any): Promise<Apiinterface> {
    try {
      const res: any = await fetch(option.apiinterface_data.url, option.apiinterface_data.option)
      const data = await res.json()
      return data;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
