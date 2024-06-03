import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { HierarchyDto, Hierarchy } from './hierarchy.interface';
import { createUUID } from '../common/helpers';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';
import { ParameterService } from '../parameter/parameter.service';
import * as _ from 'lodash'


@Injectable()
export class HierarchyService {

  constructor(
    @InjectModel('Hierarchy') private readonly hierarchyModel: Model<Hierarchy>) { }

  async create(hierarchy: HierarchyDto): Promise<Hierarchy> {
    try {
      const hierarchyData: any = await this.hierarchyModel.create(hierarchy);
      return hierarchyData;

    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, hierarchy: HierarchyDto): Promise<any> {
    try {
      const hierarchyData: any = await this.hierarchyModel.update({ _id: id }, hierarchy);
      return hierarchyData
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Hierarchy> {
    try {
      const hierarchy = await this.hierarchyModel.findById(id);
      if (!hierarchy) {
        throw Exception();
      }
      return hierarchy;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Hierarchy> {
    try {
      const hierarchy: any = await this.hierarchyModel.findByIdAndDelete(id);
      return hierarchy;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Hierarchy[]> {
    try {
      return await this.hierarchyModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCodeAndId(hierarchyCode: string, id: String): Promise<Hierarchy> {
    try {
      const hierarchy = await this.hierarchyModel.findOne({ code: hierarchyCode, _id: id });
      if (!hierarchy) {
        throw Exception();
      }
      return hierarchy;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCode(hierarchyCode: string): Promise<Hierarchy> {
    try {
      const hierarchy = await this.hierarchyModel.findOne({ code: hierarchyCode });
      if (!hierarchy) {
        throw Exception();
      }
      return hierarchy;
    } catch (e) {
      throw CustomException(e);
    }
  }

}
