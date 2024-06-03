import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { MasterDto, Master } from './master.interface';
import { createUUID } from '../common/helpers';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';
import { ParameterService } from '../parameter/parameter.service';
import { UserPermissionService } from 'src/userpermission/user-permission.service';
import _ = require('lodash');



@Injectable()
export class MasterService {

  constructor(
    @InjectModel('Master') private readonly masterModel: Model<Master>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
    private parameterService: ParameterService,
    private userPermissionService:UserPermissionService
  ) { }

  async create(master: MasterDto): Promise<Master> {
    master.code = 'M_' + master.name.toUpperCase() + '_' + await createUUID();
    try {
      const masterData: any = await this.masterModel.create(master);
      await this.parameterService.createPCollectionsArray(masterData, 'master');
      const obj = {
        modelName: masterData.code,
        formConfig: masterData.configuration,
        uniqueKey: masterData.uniqueKey
      }
      await this.dynaSchemaService.registerSchema(obj);
      return masterData
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, master: any): Promise<any> {
    try {
      const masterData: any = await this.masterModel.update({ _id: id }, master);
      await this.parameterService.deleteByIdPCollection(id);
      await this.parameterService.createPCollectionsArray(master, 'master');
      const obj = {
        modelName: master.code,
        formConfig: master.configuration,
        uniqueKey: master.uniqueKey
      }
      await this.dynaSchemaService.updateSchema(obj);
      return masterData
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Master> {
    try {
      const master = await this.masterModel.findById(id);
      if (!master) {
        throw Exception();
      }
      return master;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByName(masterName: string): Promise<Master> {
    try {
      const master = await this.masterModel.findOne({ code: masterName });
      if (!master) {
        throw Exception();
      }
      return master;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByMName(masterName: string): Promise<string> {
    try {
      const master = await this.masterModel.findOne({ name: masterName });
     
      return master.code;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByNameForDropdown(masterName: string): Promise<Master> {
    try {
      const master = await this.masterModel.findOne({ code: masterName }).select('code labelName uniqueKey');
      if (!master) {
        throw Exception();
      }
      return master;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Master> {
    try {
      const master: any = await this.masterModel.findByIdAndDelete(id);
      console.log("master",master)
      await this.parameterService.deleteByIdPCollection(id);
      await this.userPermissionService.findAndDelete(id,'master') 
      const model = await this.dynaSchemaService.getModelForScreenMasterBySchemaName(master.code);
      if (model) {
        await this.dynaSchemaService.deleteByModalName(master.code)
        model.collection.drop();
      }
      if (!master) {
        throw Exception();
      }
      return master;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(user:any): Promise<any> {
    try {
      let masters:any=[]
      if(_.includes(['superAdmin','admin'],user.roles[0])){
      masters= await this.masterModel.find();
    }else {
      let perMaster:any=[]
      let array:any=[]
      let permission = await this.userPermissionService.getPermissionByRoleAndAppName(user.roles,user.appName)
     
      _.each(permission,(master=>{
       perMaster=_.filter(master.mastersPermissoin,(o)=>{
        if(o.value===true){
          array.push(o._id)
        }
        return o.value===true})
    }))
      
      masters=await this.masterModel.find({
        '_id': { "$in": array } })    
      
      }
      return masters

    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByCodeAndId(masterCode: string, id: String): Promise<Master> {
    try {
      const master = await this.masterModel.findOne({ code: masterCode, _id: id });
      if (!master) {
        throw Exception();
      }
      return master;

    } catch (e) {
      throw CustomException(e);
    }

  }

  async findByCode(masterCode: string): Promise<Master> {
    try {
      const master = await this.masterModel.findOne({ code: masterCode });
      if (!master) {
        throw Exception();
      }
      return master;
    } catch (e) {
      throw CustomException(e);
    }

  }

}
