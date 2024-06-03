import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { ScreenDto, Screen } from './screen.interface';
import { createUUID } from 'src/common/helpers';
import { DynaSchemaService } from 'src/dynaschema/dynaschema.service';
import { ParameterService } from 'src/parameter/parameter.service';
import * as _ from 'lodash'
import {UserPermissionService} from '../userpermission/user-permission.service'

@Injectable()
export class ScreenService {

  constructor(
    @InjectModel('Screen') private readonly screenModel: Model<Screen>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
    private parameterService: ParameterService,
    private userPermissionService:UserPermissionService
  ) { }

  async create(screen: ScreenDto): Promise<Screen> {
    screen.code = 'S_' + screen.name.toUpperCase() + '_' + await createUUID();
    try {
      const columns = screen['configuration'][0]['columns']
      var paramType
      columns.forEach(item => {
        console.log("type of parameter",item['components'][0]['type'])
        paramType = item['components'][0]['type']
        if(paramType == 'datagrid'){
          screen.code = 'D_'+item['components'][0]['key'] + '_'+  createUUID();
          

        }
        // console.log(item);
      });

      const screenData: any = await this.screenModel.create(screen);
      await this.parameterService.createPCollectionsArray(screenData, 'screen');
      // const formData: any = [];
      // _.each(screenData.configuration[0].columns, (column) => {
      //   if (column && column.components.length >= 1 && column.components[0]) {
      //     formData.push(column.components[0]);
      //   }
      // })
      const obj = {
        modelName: screenData.code,
        formConfig: screenData.configuration,
        uniqueKey: screenData.uniqueKey
      }
      await this.dynaSchemaService.registerSchema(obj);
      return screenData;

    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, screen: ScreenDto): Promise<Screen> {
    try {
      const screenData: any = await this.screenModel.update({ _id: id }, screen);
      await this.parameterService.deleteByIdPCollection(id)
      await this.parameterService.createPCollectionsArray(screen, 'screen');
      // const formData: any = [];
      // _.each(screen.configuration[0].columns, (column) => {
      //   if (column && column.components.length >= 1 && column.components[0]) {
      //     formData.push(column.components[0]);
      //   }
      // })
      const obj = {
        modelName: screen.code,
        formConfig: screen.configuration,
        uniqueKey: screen.uniqueKey

      }
      await this.dynaSchemaService.updateSchema(obj)
      return screenData
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Screen> {
    try {
      const screen = await this.screenModel.findById(id);
      if (!screen) {
        throw Exception();
      }
      return screen;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Screen> {
    try {
      const screen: any = await this.screenModel.findByIdAndDelete(id);
      await this.parameterService.deleteByIdPCollection(id);
       await this.userPermissionService.findAndDelete(id,'screen') 
      const model = await this.dynaSchemaService.getModelForScreenMasterBySchemaName(screen.code);
      if (model) {
        await this.dynaSchemaService.deleteByModalName(screen.code)
        model.collection.drop();
      }
      if (!screen) {
        throw Exception();
      }
      return screen;

    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Screen[]> {
    try {
      
      return await this.screenModel.find({"application_master": {"$ne": ""}});
    } catch (e) {
      throw CustomException(e);
    }
  }
  async getMenuScreen(): Promise<Screen[]> {
    try {
      
      return await this.screenModel.find({}).select('_id name code application_master');
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCodeAndId(screenCode: string, id: String): Promise<Screen> {
    try {
      const screen = await this.screenModel.findOne({ code: screenCode, _id: id });
      if (!screen) {
        throw Exception();
      }
      return screen;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCode(screenCode: string): Promise<Screen> {
    try {
      const screen = await this.screenModel.findOne({ code: screenCode });
      if (!screen) {
        throw Exception();
      }
      return screen;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findScreenName(screenCode: string): Promise<Screen> {
    try {
      const screen = await this.screenModel.findOne({ code: screenCode }).select('name');
      if (!screen) {
        throw Exception();
      }
      return screen;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByNameForDropdown(screenName: string): Promise<Screen> {
    try {
      const screen = await this.screenModel.findOne({ code: screenName }).select('code labelName uniqueKey');
      if (!screen) {
        throw Exception();
      }
      return screen;
    } catch (e) {
      throw CustomException(e);
    }
  }
  async findAppById(id: String): Promise<Screen[]> {
    try {
      return await this.screenModel.find({ application_master: id });      
    } catch (e) {
      throw CustomException(e);
    }
  }
}
