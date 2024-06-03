import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Parameter, ParameterDto, ParameterCollection } from './parameter.interface';
import { Exception, CustomException } from '../common/exceptions';
import { createUUID } from '../common/helpers';



@Injectable()
export class ParameterService {

  constructor(
    @InjectModel('Parameter') private readonly parameterModel: Model<Parameter>,
    @InjectModel('ParameterCollection') private readonly parameterCollectionModel: Model<ParameterCollection>,
  ) { }

  /**
   * @throws duplicate key error when
   */
  async create(parameter: ParameterDto): Promise<Parameter> {
    const __code = 'P_' + parameter.name.toUpperCase() + '_' + await createUUID();
    parameter.code = __code;
    parameter.uniqueKey = parameter.name.toUpperCase() + parameter.externalCode.toUpperCase();
    parameter.configuration.forEach((element: any) => {
      element['__code'] = __code;
    });
    try {
      const parameterData = await this.parameterModel.create(parameter);
      return parameterData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, parameter: ParameterDto): Promise<any> {
    try {
      return await this.parameterModel.update({ _id: id }, parameter);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Parameter[]> {
    try {
      return await this.parameterModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Parameter> {
    try {
      const parameter = await this.parameterModel.findById(id);
      if (!parameter) {
        throw Exception();
      }
      return parameter;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Parameter> {
    try {
      const parameter = await this.parameterModel.findByIdAndDelete(id);
      if (!parameter) {
        throw Exception();
      }
      return parameter;
    } catch (e) {
      throw CustomException(e);
    }
  }


  // Parameter Collection service methods


  async createPCollectionsArray(data: any, dataType: any) {
    try {
      const dataConfig = (dataType == 'master' ? data.configuration : data.configuration[0].columns);
      let pCollection: any = [];
      dataConfig.forEach((element: any) => {
        let tempObj: any = {
          "masterScreenId": data._id,
          "masterScreenName": data.name,
          "masterScreenCode": data.code,
          "masterScreenType": dataType,
          "parameterCode": dataType == 'master' ? (element.__code || 'temp') : (element.components[0].__code || 'temp')
        };
        pCollection.push(tempObj);
      });
      return await this.createPCollections(pCollection);
    } catch (e) {
      throw CustomException(e);
    }

  }


  async createPCollection(parameterColleaction: any): Promise<ParameterCollection> {
    try {
      return await this.parameterCollectionModel.create(parameterColleaction);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async createPCollections(parameterColleaction: any): Promise<any> {
    try {
      return await this.parameterCollectionModel.insertMany(parameterColleaction);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async updatePCollection(id: string, parameterColleaction: any): Promise<any> {
    try {
      return await this.parameterCollectionModel.update({ _id: id }, parameterColleaction);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAllPCollectionByParameterCode(parameterCode: String): Promise<ParameterCollection[]> {
    try {
      return await this.parameterCollectionModel.find({ parameterCode: parameterCode });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByIdPCollection(id: string): Promise<ParameterCollection[]> {
    try {
      const parameterCollection: any = await this.parameterCollectionModel.findById(id);
      if (!parameterCollection) {
        throw Exception();
      }
      return parameterCollection;
    } catch (e) {
      throw CustomException(e);
    }

  }

  async deleteByIdPCollection(masterScreenId: string): Promise<ParameterCollection[]> {
    try {
      const parameterCollection: any = await this.parameterCollectionModel.deleteMany({ masterScreenId: masterScreenId });
      if (!parameterCollection) {
        throw Exception();
      }
      return parameterCollection;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
