import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TDynaSchema, DynaSchemaDto } from './dynaschema.interface';
import { Exception, CollectionAlreadyExistsException, CustomException, DuplicateData } from '../common/exceptions';
import { MasterDetailsDto, Master } from '../master/master.interface';
import { MasterService } from '../master/master.service';
// const CsvParser = require("json2csv").Parser;
var fs = require('fs');
import { parse } from '@fast-csv/parse';
import { ScreenService } from '../screen/screen.service';
import { ReportService } from '../report/report.service';
import { RulesService } from '../rules/rules.service';
import { WorkflowService } from '../workflow/workflow.service';
import { WfinstanceService } from '../wfinstance/wfinstance.service';
import { EmailService } from '../emails/email.service';
let Client = require('ssh2-sftp-client');
let sftp = new Client();
import * as moment from 'moment';
import _ = require('lodash');
import { UserService } from '../user/user.service';
import { ScreenPermissionService } from '../screenPermission/screen-permission.service';
import { DbConfigService } from '../db-config/db-config.service';
import { json } from 'express';
import { ApiConfigService } from 'src/api-config/api-config.service';
var csv = require("csvtojson");
const { Pool, Client1 } = require("pg");
var mysql = require('mysql2/promise');
const axios = require('axios');


@Injectable()
export class DynaSchemaService implements OnModuleInit {

  private modelMap = new Map<String, mongoose.Model<any>>();
  constructor(
    @InjectModel('DynaSchema') private readonly dynaSchemaModel: Model<TDynaSchema>,
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => MasterService))
    private masterService: MasterService,
    @Inject(forwardRef(() => ScreenService))
    private screenService: ScreenService,
    @Inject(forwardRef(() => ReportService))
    private reportService: ReportService,
    private workflowService: WorkflowService,
    private wfinstanceService: WfinstanceService,
    private emailService: EmailService,
    private rulesService: RulesService,
    private userService: UserService,
    private dbconfigService: DbConfigService,
    private apiconfigService: ApiConfigService,
    private screenPermissionService: ScreenPermissionService

  ) { }

  async registerSchema(dynaSchemaDto: DynaSchemaDto): Promise<TDynaSchema> {
    const schemaConfig = await this.generateMongooseSchema(dynaSchemaDto);
    let uniqueKey = {} as any
    if (dynaSchemaDto.uniqueKey.length > 0) {
      uniqueKey = await this.generateUniquekey(dynaSchemaDto)
    }
    try {
      if (! await this.dynaSchemaModel.exists({ model_name: dynaSchemaDto.modelName })) {
        const schema = await this.dynaSchemaModel.create({
          model_name: dynaSchemaDto.modelName,
          form_config: dynaSchemaDto.formConfig,
          schema_config: schemaConfig,
          uniqueKey: dynaSchemaDto.uniqueKey,
          uniqueConfig: uniqueKey
        });
        await this.addModelToMap(dynaSchemaDto.modelName, schemaConfig, uniqueKey);
        return schema;
      } else {
        // console.log('already exits');
        throw CollectionAlreadyExistsException();
      }
    } catch (e) {
      // console.log('eregisterschema', e)
      throw CustomException(e);
    }
  }
  generateUniquekey(dynaSchemaDto: DynaSchemaDto): Promise<any> {
    const uniqueKey = {} as any
    dynaSchemaDto.uniqueKey.forEach((element: any) => {
      uniqueKey[element] = 1
    })
    return uniqueKey
  }


  async updateSchema(dynaSchemaDto: DynaSchemaDto): Promise<TDynaSchema> {

    const schemaConfig = await this.generateMongooseSchema(dynaSchemaDto);
    try {
      const schema: any = await this.dynaSchemaModel.updateOne(
        { model_name: dynaSchemaDto.modelName },
        {
          form_config: dynaSchemaDto.formConfig,
          schema_config: schemaConfig,
        }
      );
      this.updateModelToMap(dynaSchemaDto.modelName, schemaConfig);
      return schema;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async checkCollectionExistsByName(masterName: string): Promise<boolean> {
    try {
      return await this.dynaSchemaModel.exists({ model_name: masterName });
    } catch (e) {
      throw CustomException(e);
    }
  }

  private generateMongooseSchema(dynaSchemaDto: any): any {
    const schemaConfig = {} as any;
    schemaConfig['status'] = { type: 'string', required: false, default: null };
    dynaSchemaDto.formConfig.forEach((element: any) => {
      if (element.type === 'textfield' || element.type === 'textarea') {
        schemaConfig[element.key] = { type: 'string', required: element.validate.required };
      } else if (element.type === 'number') {
        schemaConfig[element.key] = { type: 'number', required: element.validate.required };
      } else if (element.type === 'select') {
        // tslint:disable-next-line: max-line-length
        if (element.multiple) {
          schemaConfig[element.key] = { type: 'mixed', required: element.validate.required };
        } else {
          schemaConfig[element.key] = { type: 'string', required: element.validate.required };
        }
      } else if (element.type === 'datetime') {
        schemaConfig[element.key] = { type: 'Date', format: element.format, required: element.validate.required };
      } else if (element.type === 'file') {
        schemaConfig[element.key] = { type: 'mixed', required: element.validate.required, unique: false };
      } else if (element.type === 'datagrid') {
        const schemaList: any = [];
        element.components.forEach((data: any) => {
          const obj: any = {};
          if (data.type === 'textfield' || data.type === 'textarea') {
            obj[data.key] = { type: 'string', required: data.validate.required, unique: false };
            schemaList.push(obj);
          }
          if (data.type === 'number') {
            obj[data.key] = { type: 'number', required: data.validate.required, unique: false };
            schemaList.push(obj);
          }
          if (data.type === 'datetime') {
            obj[data.key] = { type: 'Date', required: data.validate.required, unique: false };
            schemaList.push(obj);
          }
        });
        schemaConfig[element.key] = schemaList;
      } else if (element.type === 'datamap') {
        if (element.valueComponent.type === 'textfield' || element.valueComponent.type === 'textarea') {
          // tslint:disable-next-line: max-line-length
          schemaConfig[element.key] = { type: 'mixed', required: element.valueComponent.validate.required, unique: false };
        }
      } else if (element.type === 'columns') {
        // console.log('columnnnnnnn cpoumns', element.columns)
        element.columns.forEach((subElement: any) => {
          subElement.components.forEach((subElementChild: any) => {
            if (dynaSchemaDto.uniqueKey == undefined || dynaSchemaDto.uniqueKey == null) {

              if (subElementChild.type === 'textfield' || subElementChild.type === 'textarea') {
                schemaConfig[subElementChild.key] = { type: 'string', required: subElementChild.validate.required, unique: false };
              } else if (subElementChild.type === 'number') {
                schemaConfig[subElementChild.key] = { type: 'number', required: subElementChild.validate.required, unique: false };
              } else if (subElementChild.type === 'select') {
                if (subElementChild.multiple) {
                  schemaConfig[subElementChild.key] = { type: 'mixed', required: subElementChild.validate.required, unique: false };
                } else {
                  schemaConfig[subElementChild.key] = { type: 'string', required: subElementChild.validate.required, unique: false };
                }
              } else if (subElementChild.type === 'datetime') {
                // tslint:disable-next-line: max-line-length
                if (dynaSchemaDto.uniqueKey == undefined || dynaSchemaDto.uniqueKey == null) {
                  schemaConfig[subElementChild.key] = { type: 'Date', format: subElementChild.format, required: subElementChild.validate.required, unique: false };
                } else {
                  schemaConfig[subElementChild.key] = { type: 'Date', format: subElementChild.format, required: subElementChild.validate.required, unique: false };
                }
              } else if (subElementChild.type === 'file') {
                schemaConfig[subElementChild.key] = { type: 'mixed', required: subElementChild.validate.required, unique: false };
              } else if (subElementChild.type === 'datagrid') {
                schemaConfig[subElementChild.key] = { type: 'mixed', required: false, unique: false };
              } else if (subElementChild.type === 'datamap') {
                if (subElementChild.valueComponent.type === 'textfield' || subElementChild.valueComponent.type === 'textarea') {
                  schemaConfig[subElementChild.key] = { type: 'mixed', required: subElementChild.valueComponent.validate.required, unique: false };
                }
              }

            } else {
              if (subElementChild.type === 'textfield' || subElementChild.type === 'textarea') {
                // console.log('1')
                // tslint:disable-next-line: max-line-length'
                if (dynaSchemaDto.uniqueKey == undefined || dynaSchemaDto.uniqueKey == null) {
                  schemaConfig[subElementChild.key] = { type: 'string', required: subElementChild.validate.required, unique: false };
                } else {
                  schemaConfig[subElementChild.key] = { type: 'string', required: subElementChild.validate.required };
                }
              } else if (subElementChild.type === 'number') {
                // console.log('2')
                if (dynaSchemaDto.uniqueKey == undefined || dynaSchemaDto.uniqueKey == null) {
                  schemaConfig[subElementChild.key] = { type: 'number', required: subElementChild.validate.required, unique: false };
                } else {
                  // tslint:disable-next-line: max-line-length
                  schemaConfig[subElementChild.key] = { type: 'number', required: subElementChild.validate.required };
                }
              } else if (subElementChild.type === 'select') {
                // console.log('3')
                // tslint:disable-next-line: max-line-length
                if (subElementChild.multiple) {
                  schemaConfig[subElementChild.key] = { type: 'mixed', required: subElementChild.validate.required };
                } else {
                  schemaConfig[subElementChild.key] = { type: 'string', required: subElementChild.validate.required };
                }
              } else if (subElementChild.type === 'datetime') {
                // console.log('4')
                // tslint:disable-next-line: max-line-length
                if (dynaSchemaDto.uniqueKey == undefined || dynaSchemaDto.uniqueKey == null) {
                  schemaConfig[subElementChild.key] = { type: 'Date', format: subElementChild.format, required: subElementChild.validate.required, unique: false };
                } else {
                  schemaConfig[subElementChild.key] = { type: 'Date', format: subElementChild.format, required: subElementChild.validate.required };
                }
              } else if (subElementChild.type === 'file') {
                // console.log('5')
                schemaConfig[subElementChild.key] = { type: 'mixed', required: subElementChild.validate.required, unique: false };
              } else if (subElementChild.type === 'datagrid') {
                // console.log('6')
                // let schemaList: any = [];
                // subElementChild.components.forEach((data: any, index: any) => {
                //   let obj: any = {};
                //   if (data.type === 'textfield' || data.type === 'textarea') {
                //     obj[data.key] = { type: 'string', required: data.validate.required, unique: data.validate.unique };
                //     schemaList.push(obj);
                //   }
                //   if (data.type === 'number') {
                //     obj[data.key] = { type: 'number', required: data.validate.required, unique: data.validate.unique };
                //     console.log(obj, "obj obj obj obj", obj[data.key])
                //     schemaList.push(obj);
                //   }
                //   if (data.type === 'datetime') {
                //     obj[data.key] = { type: 'Date', required: data.validate.required, unique: data.validate.unique };
                //     schemaList.push(obj);
                //   }
                //   if (index === subElementChild.components.length - 1) {
                //     console.log('schemaListin if if schemaList schemaList', schemaList)
                //     schemaConfig[subElementChild.key] = schemaList;
                //   }
                // });
                // console.log('schemaList schemaList schemaList', schemaList)

                // we created mixed type of datagrid

                schemaConfig[subElementChild.key] = { type: 'mixed', required: false, unique: false };
              } else if (subElementChild.type === 'datamap') {
                if (subElementChild.valueComponent.type === 'textfield' || subElementChild.valueComponent.type === 'textarea') {
                  // tslint:disable-next-line: max-line-length
                  schemaConfig[subElementChild.key] = { type: 'mixed', required: subElementChild.valueComponent.validate.required, unique: false };
                }
              }
            }
          })
        });
      }
      // default columns for each schema => code, discription, dates, type, version, status
    });
    return schemaConfig;
  }

  private async addModelToMap(modelName: string, schemaConfig: any, uniqueKey: any) {
    try {
      if (_.isEmpty(uniqueKey)) {
        await this.modelMap.set(modelName, this.connection.model(modelName, new mongoose.Schema(schemaConfig)));
      } else {
        await this.modelMap.set(modelName, this.connection.model(modelName, new mongoose.Schema(schemaConfig).index(uniqueKey, { unique: true })));
      }
    } catch (e) {
      throw CustomException(e);
    }
  }

  private async updateModelToMap(modelName: string, schemaConfig: any) {
    try {
      await this.connection.deleteModel(modelName);
      await this.modelMap.set(modelName, this.connection.model(modelName, new mongoose.Schema(schemaConfig)));

    } catch (e) {
      throw CustomException(e);
    }
  }

  private removeModelFromMap(modelName: string) {
    this.modelMap.delete(modelName);
  }

  onModuleInit() {
    this.dynaSchemaModel.find().exec().then((ds: any) => {
      ds.map((d: any) => {
        this.addModelToMap(d.model_name, d.schema_config, d.uniqueConfig);
      });
    });
  }

  async getModelForScreenMasterBySchemaName(modelName: string): Promise<mongoose.Model<any> | undefined> {
    try {
      const model: mongoose.Model<any> | undefined = await this.modelMap.get(modelName);
      return model
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getModelForSchemaName(modelName: string): Promise<mongoose.Model<any>> {
    try {
      const model: mongoose.Model<any> | undefined = await this.modelMap.get(modelName);
      if (model) {
        return model;
      } else {
        throw Exception;
      }
    } catch (e) {
      // console.log('Model For schema exception', e)
      throw CustomException(e);
    }
  }

  async getMasterDetailListByName(masterName: string): Promise<any[]> {
    const model = await this.getModelForSchemaName(masterName);


    try {
      return model.find({ status: { $nin: ['Unpublished', 'Rejected'] } });

    } catch (e) {
      throw CustomException(e);
    }
  }
  async getMasterDetailListByNameAndCode(masterName: string, user: any, type:string,appName:string): Promise<any[]> {
    const model = await this.getModelForSchemaName(masterName);
    let tempvar: any = null
    if (type === 'screen') {
      let config = await this.screenService.findByCode(masterName);
      _.each(config.configuration[0].columns, (component, index) => {

        if (component.components[0].type === 'file') {
          // if (tempvar === '') { tempvar = '-' + component.components[0].key } else {
          //   tempvar = tempvar + ' -' + component.components[0].key
          // }
          if (!tempvar) {
            tempvar = { [component.components[0].key]: 0 };
          } else {
            tempvar[component.components[0].key] = 0;
          }

        } else if (component.components[0].type === 'datagrid') {
        if (!tempvar) {
          tempvar = {};
        }
          _.each(component.components[0].components, (cmp) => {
            if (cmp.type === 'file') {
              tempvar[`${component.components[0].key}.${cmp.key}`] = 0;
              // if (tempvar === '') {
              //   // tempvar = '-' + component.components[0].key
              //   tempvar = '{' + component.components[0].key+ '.'+cmp.key+': 0'+ '}'
              // }
              // else {
              //   tempvar = tempvar + ' -' + component.components[0].key
              // }
            }
          })
        }
      })
    }
    try {
      
      if (_.includes(user.roles, 'superAdmin') || _.includes(user.roles, 'admin' )|| !(appName==='62429fc8505a0d4e66f9c6a2')) {

        return model.find({ status: { $nin: ['Unpublished', 'Rejected'] } }).select(tempvar)
      } else {
        let empId = await this.userService.findReporter(user.employeeId)
        if (empId) {

          return model.find({ employeecode: { "$in": [user.employeeId, empId.employeeId] }, status: { $nin: ['Unpublished', 'Rejected'] } }).select(tempvar);
        } else {

          return model.find({ employeecode: user.employeeId, status: { $nin: ['Unpublished', 'Rejected'] } }).select(tempvar);
        }


      }

    } catch (e) {
      throw CustomException(e);
    }
  }

  async getMasterQueryData(masterName: string, req: any): Promise<any[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {
      return model.find(req);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getScreenQueryData(masterName: string, req: any): Promise<any[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {
      return model.find(req);
    } catch (e) {
      throw CustomException(e);
    }
  }


  async getByNameAndId(masterName: string, id: string): Promise<any[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {
      return model.findById(id);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getScreenDataByNameAndId(masterName: string, id: string, user: any): Promise<any> {
    const model = await this.getModelForSchemaName(masterName);

    try {
      return {
        screenData: await model.findById(id),
        screenPermission: await this.screenPermissionService.getByNameAndRoleName(masterName, user.roles[0])
      }
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getDropdownData(masterName: string, query: any): Promise<any> {

    const masterData = await this.getMasterQueryData(masterName, query);;
    const response = {
      metadata: {},
      datasource: masterData,
    };
    try {
      response.metadata = await this.masterService.findByNameForDropdown(masterName);
      return response;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getMasterDataBE(masterName: string, req: any): Promise<any> {
    const masterData = await this.getMasterQueryData(masterName, req);
    const response = {
      metadata: {},
      datasource: masterData,
    };
    try {
      response.metadata = await this.masterService.findByNameForDropdown(masterName);
      return response;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getDropdownDataScreen(screenName: string): Promise<any> {
    const screenData = await this.getMasterDetailListByName(screenName);
    const response = {
      metadata: {},
      datasource: screenData,
    };
    try {
      response.metadata = await this.screenService.findByNameForDropdown(screenName);
      return response;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getJointschema(type: string, typevalue: string): Promise<any> {

    var masterName = "M_POLICY_hCj4CH";
    const model = await this.getModelForSchemaName(masterName);

    try {
      var resData: any;
      if (type == 'policyNo') {
        resData = await model.aggregate([
          { "$match": { "policyNo": typevalue } },
          {
            $lookup:
            {
              from: 'm_claim_hhywjzs',
              localField: 'policyNo',
              foreignField: 'policyNo',
              as: 'claims'
            }
          }
        ])
      } else if (type == 'rsaId') {
        resData = await model.aggregate([
          { "$match": { "rsaId": typevalue } },
          {
            $lookup:
            {
              from: 'm_claim_hhywjzs',
              localField: 'rsaId',
              foreignField: 'rsaId',
              as: 'claims'
            }
          }
        ])
      }
      return resData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getJointClaimschema(type: string, typevalue: string): Promise<any> {
    var Obj: any = {};
    Obj[type] = typevalue;
    var masterName = "M_CLAIM_hhYwJZ";
    const model = await this.getModelForSchemaName(masterName);
    var resData: any;
    try {
      resData = await model.find(Obj);
      return resData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  // async getDataExt(type: string): Promise<any> { //name: string, code: string
  //   try {
  //     var resData;
  //     // console.log('tyNmae', type)
  //     if (type == 'master') {
  //       resData = await this.masterService.getAll();
  //     } else if (type == 'screen') {
  //       resData = await this.screenService.getAll()
  //     } else if (type == 'report') {
  //       resData = await this.reportService.getAll();
  //     }
  //     return resData;
  //   } catch (e) {
  //     // console.log('er', e)
  //     throw CustomException(e);
  //   }
  // }

  async getDataExt1(type: string, name: string, code: string): Promise<any> { //
    try {
      var resData;
      // console.log('tyNmae', type, name, code)
      if (type == 'master') {
        resData = await this.getMasterDetailListByName(code);
      } else if (type == 'screen') {
        resData = await this.getMasterDetailListByName(code);
      } else if (type == 'report') {
        resData = await this.reportService.getAll();
      }
      return resData;
    } catch (e) {
      // console.log('er', e)
      throw CustomException(e);
    }
  }

  async getDataListByName(typeName: string): Promise<any> {
    const model = await this.getModelForSchemaName(typeName);
    try {
      return model.find({ status: { $nin: ['null'] } });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getScreenDataBE(screenName: string, query: any): Promise<any> {
    const screenData = await this.getScreenQueryData(screenName, query);
    const response = {
      metadata: {},
      datasource: screenData,
    };
    try {
      response.metadata = await this.screenService.findByNameForDropdown(screenName);
      return response;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteSchemaRecord(masterName: string, id: string): Promise<any[]> {
    try {
      const data = await this.dbconfigService.find(masterName)
      if (data) {
        if (data.db === 'postgres') {
          const credentials = {
            user: data.user,
            host: data.host,
            database: data.database,
            password: data.password,
            port: data.port
          };
          // let { Client } = require('pg');
          const pool = new Pool(credentials);
          //  await pool.connect();
          const now = await pool.query(`DELETE FROM ${data.tableName} WHERE exp_id= '${id}'`);
          await pool.end();

        }
        if (data.db === 'mySql') {
          var connection: any
          connection = await mysql.createConnection({
            host: data.host,
            user: data.user,
            password: data.password,
            database: data.database
          });
          await connection.connect();
          const now = await connection.query(`DELETE FROM ${data.tableName} WHERE exp_id= '${id}';`)
          await connection.end();
          return now;
        }
      }
      const model = await this.getModelForSchemaName(masterName);
      return await model.findByIdAndDelete(id);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async sftpFIleUplaod(code: any, resData: any) {
    try {
      await sftp.connect({
        host: '182.72.205.195',
        port: 22,
        username: 'Aerogen',
        password: 'aerogen'
      });
      const checkExits = await sftp.exists(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/`);
      // console.log('checkExits checkExits', checkExits)
      if (!checkExits) {
        await sftp.mkdir(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/`, true);
      }
      // await sftp.mkdir('/opt/OpenSourceProjects/Betamartix/Landing_Dir/aerogen/', true);
      await sftp.append(Buffer.from(JSON.stringify(resData)), `/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/${resData._id}.txt`);
      // const sftpStore = await sftp.append(Buffer.from(JSON.stringify(resData)), `/opt/Aerospike_gen_data_file/${masterDetailsDto.name}_${resData._id}.txt`);
      // console.log('sftpStore sftpStore', sftpStore)
      // console.log('jhkjgkhkjhkh', await sftp.list(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/`));
      // console.log('jhkjgkhkjhkh11111', await sftp.list(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/`));

      await sftp.end();
    } catch (e) {
      // throw CustomException(e);
    }
  }

  async addMasterDetail(req: any, masterDetailsDto: MasterDetailsDto): Promise<any[]> {
    try {
      const data = await this.dbconfigService.find(masterDetailsDto.name)
      const apiconfigData = await this.apiconfigService.apiFind(masterDetailsDto.name)

      const model = await this.getModelForSchemaName(masterDetailsDto.name);
      const wfData = await this.workflowService.findByScreenCodeAndTriggerName(masterDetailsDto.name, 'Add');
      masterDetailsDto.configuration['status'] = 'Unpublished';
      const resData = await model.create(masterDetailsDto.configuration);
      let flag: any = false;
      let triggredWf: any = wfData.find((wf: any) => (wf.rule == '' || wf.rule == null));

      var forEachComplete = new Promise(async (resolve: any, reject: any) => {
        for (let i = 0; i < wfData.length; i++) {
          // console.log(triggredWf._id, 'triggredWf._id wfData[i]._id)', wfData[i]._id)
          if (triggredWf._id != wfData[i]._id) {
            if (flag) { return };
            let rule: any = await this.rulesService.findById(wfData[i].rule);
            let mongoQuery: any;
            if (JSON.parse(rule.configuration).condition == 'OR') {
              mongoQuery = { "$and": [JSON.parse(rule.mongoQuery), { '_id': resData._id }] }
            } else {
              mongoQuery = JSON.parse(rule.mongoQuery);
              mongoQuery["$and"].push({ '_id': resData._id });
              // console.log(mongoQuery, 'rule.mongoQuery rule.mongoQuery', mongoQuery['$and'][0].price);

            }
            const recordExits = await model.find(mongoQuery);
            // console.log(recordExits.length, 'recordExits recordExits', recordExits);
            if (recordExits.length > 0) {
              // console.log('ini in in in in in in in')
              flag = true
              triggredWf = wfData[i];
              resolve();
            }
          }
          if (i == (wfData.length - 1)) {
            // console.log('check check check');
            resolve();
          }
        }
        // wfData.forEach(async (wf: any, index: any) => {
        //   if (flag) { return };
        //   let rule: any = await this.rulesService.findById(wf.rule);
        //   let mongoQuery: any;
        //   if (JSON.parse(rule.configuration).condition == 'OR') {
        //     mongoQuery = { "$and": [JSON.parse(rule.mongoQuery), { '_id': resData._id }] }
        //   } else {
        //     mongoQuery = JSON.parse(rule.mongoQuery);
        //     mongoQuery["$and"].push({ '_id': resData._id })
        //   }
        //   console.log('rule.mongoQuery rule.mongoQuery', mongoQuery)
        //   const recordExits = await model.find(mongoQuery);
        //   console.log(recordExits.length, 'recordExits recordExits', recordExits);
        //   if (recordExits.length > 0) {
        //     // console.log('ini in in in in in in in')
        //     flag = true
        //     triggredWf = wf;
        //     resolve();
        //   }
        //   if (index == (wfData.length - 1)) {
        //     console.log('check check check');
        //     resolve();
        //   }
        // });
      });
      if (wfData.length > 0) {
        forEachComplete.then(async () => {

          if (flag || triggredWf) {

            await this.wfinstanceService.triggerWf(req, resData, triggredWf);
          } else {

            masterDetailsDto.configuration['status'] = 'Published';
            await model.update({ _id: resData.id }, masterDetailsDto.configuration);
          }
        })
      } else {
        masterDetailsDto.configuration['status'] = 'Published';
        await model.update({ _id: resData.id }, masterDetailsDto.configuration);
      }
      if (resData) {
        if (data) {
          let existinkeys: any
          let configkeyData: any = []
          if (data.db === 'postgres') {
            const credentials = {
              user: data.user,
              host: data.host,
              database: data.database,
              password: data.password,
              port: data.port
            };

            const pool = new Pool(credentials);

            // await client.connect(); 
            if (data.existingTable == true) {
              const obj = data.config.reduce((accumalator, currentvalue) => {
                return ({ ...accumalator, ...currentvalue })
              }, {})
              existinkeys = Object.values(obj).join()
            } else {
              data.config.forEach(item => {
                configkeyData.push(item.key)
              })

              existinkeys = configkeyData.join()
            }
            delete masterDetailsDto.configuration["submit"];
            const values = Object.values(masterDetailsDto.configuration)
            values.pop();
            values.push(`${resData._id}`)
            var valueskey: any = []
            values.map((value, i) => {
              valueskey.push(`$${i + 1}`)
            })
            const text = `
                        INSERT INTO "${data.tableName}" (${existinkeys},exp_id)
                        VALUES (${valueskey})
                      `;

            const now = pool.query(text, values);
            await pool.end();

          } else if (data.db === 'mySql') {
            var connection: any
            connection = await mysql.createConnection({
              host: data.host,
              user: data.user,
              password: data.password,
              database: data.database
            });
            await connection.connect();
            if (data.existingTable == true) {
              const obj = data.config.reduce((accumalator, currentvalue) => {
                return ({ ...accumalator, ...currentvalue })
              }, {})
              existinkeys = Object.values(obj).join()
            } else {
              data.config.forEach(item => {
                configkeyData.push(item.key)
              })
              existinkeys = configkeyData.join()
            }
            let sqlQuery: any
            delete masterDetailsDto.configuration["submit"];
            const values = Object.values(masterDetailsDto.configuration)
            values.pop();
            values.push(`${resData._id}`)
            let string = "'" + values.join("','") + "'";
            sqlQuery = `INSERT INTO ${data.tableName} (${existinkeys},exp_id) VALUES (${string})`

            const now = await connection.query(`${sqlQuery}`)

            await connection.end();
          }
        }
        if (apiconfigData) {
          let obj = {};
          delete masterDetailsDto.configuration["submit"];
          let config = apiconfigData.config.reduce((accumalator, currentvalue) => {
            return ({ ...accumalator, ...currentvalue })
          }, {})
          let configarray = Object.keys(config)
          configarray.forEach(element => {
            if (masterDetailsDto.configuration.hasOwnProperty(element)) {
              obj[config[element]] = masterDetailsDto.configuration[element]
            }
          })

          axios.post(`${apiconfigData.url}`, obj)
            .then(res => {
              console.log(`statusCode: ${res.status}`);
              console.log(res);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
      return resData;
    } catch (e) {
      if(e.code===11000){
        throw DuplicateData()
      }else{
        throw CustomException(e);
      }
    }
  }

  async addMasterDetails(masterDetailsDto: any): Promise<any> {
    const model = await this.getModelForSchemaName(masterDetailsDto.name);
    let successRecord: any = [];
    let failureRecord: any = [];
    let pool: any
    let text: any
    var valueskey: any = []
    let existinkeys: any
    let configkeyData: any = []
    const data = await this.dbconfigService.find(masterDetailsDto.name)
    if (data) {
      if (data.db === 'postgres') {
        const credentials = {
          user: data.user,
          host: data.host,
          database: data.database,
          password: data.password,
          port: data.port
        };
        pool = new Pool(credentials);
      } else if (data.db == 'mySql') {
        var connection: any
        connection = await mysql.createConnection({
          host: data.host,
          user: data.user,
          password: data.password,
          database: data.database
        });
        await connection.connect();

      }
      // await client.connect(); 
      if (data.existingTable == true) {
        const obj = data.config.reduce((accumalator, currentvalue) => {
          return ({ ...accumalator, ...currentvalue })
        }, {})
        existinkeys = Object.values(obj).join()
      } else if (data.db == 'mySql') {
        data.config.forEach(item => {
          configkeyData.push(item.key)
        })
        existinkeys = configkeyData.join()
      }
    }


    let foreachPromise = new Promise(async (resolve, reject) => {
      for (let i = 0; i < masterDetailsDto.configuration.length; i++) {
        let exist: any = []
        let existMsg: string = ''
        let seletct:string=''

        let foreachPromise1 = new Promise(async (resolve1: any, reject: any) => {
          if (masterDetailsDto.screenConfig) {
            for (let j = 0; j < masterDetailsDto.screenConfig.length; j++) {
              if (masterDetailsDto.screenConfig[j].components[0].type === 'select' && masterDetailsDto.screenConfig[j].components[0].dataSrc === 'master') {
                let name = masterDetailsDto.screenConfig[j].components[0].valueProperty
                let query = {}
                query[name] = masterDetailsDto.configuration[i][masterDetailsDto.screenConfig[j].components[0].key]
                exist = await this.getMasterQueryData(masterDetailsDto.screenConfig[j].components[0].data.master.code, query)
                seletct=masterDetailsDto.screenConfig[j].components[0].type
                if (exist.length < 1) {
                  existMsg = existMsg + masterDetailsDto.screenConfig[j].components[0].label + ' does  not exist '
                  resolve1()
                }
              }
              if (j == (masterDetailsDto.screenConfig.length - 1)) {
                resolve1()
              }

            }
          } else {
            resolve1()
          }
        });

        foreachPromise1.then(async () => {
          try {

            if (masterDetailsDto.screenConfig) {
              if (seletct === 'select') {
                if (exist.length < 1) {
                  const errorObj = { record: masterDetailsDto.configuration[i], error: existMsg }
                  failureRecord.push(errorObj);
                }else{
                  let rData: any = await model.create(masterDetailsDto.configuration[i]);
                successRecord.push(rData);
                if (rData && data) {
                  if (data.db === 'postgres') {
                    let values: any = []
                    values = Object.values(masterDetailsDto.configuration[i])
                    values.push(`${rData._id}`);
                    values.map((value, i) => {
                      valueskey.push(`$${i + 1}`)
                    })
                    text = `
              INSERT INTO "${data.tableName}" (${existinkeys},exp_id)
              VALUES (${valueskey})
            `;
                    const now = pool.query(text, values);
                  } else if (data.db === 'mySql') {
                    let sqlQuery: any
                    delete masterDetailsDto.configuration["submit"];
                    const values = Object.values(masterDetailsDto.configuration[i])
                    values.push(`${rData._id}`)
                    let string = "'" + values.join("','") + "'";
                    sqlQuery = `INSERT INTO ${data.tableName} (${existinkeys},exp_id) VALUES (${string})`
                    const now = await connection.query(`${sqlQuery}`)
                  }
                }
                }
              } else {
                let rData: any = await model.create(masterDetailsDto.configuration[i]);
                successRecord.push(rData);
                if (rData && data) {
                  if (data.db === 'postgres') {
                    let values: any = []
                    values = Object.values(masterDetailsDto.configuration[i])
                    values.push(`${rData._id}`);
                    values.map((value, i) => {
                      valueskey.push(`$${i + 1}`)
                    })
                    text = `
              INSERT INTO "${data.tableName}" (${existinkeys},exp_id)
              VALUES (${valueskey})
            `;
                    const now = pool.query(text, values);
                  } else if (data.db === 'mySql') {
                    let sqlQuery: any
                    delete masterDetailsDto.configuration["submit"];
                    const values = Object.values(masterDetailsDto.configuration[i])
                    values.push(`${rData._id}`)
                    let string = "'" + values.join("','") + "'";
                    sqlQuery = `INSERT INTO ${data.tableName} (${existinkeys},exp_id) VALUES (${string})`
                    const now = await connection.query(`${sqlQuery}`)
                  }
                }
              }
            } else {
              let rData: any = await model.create(masterDetailsDto.configuration[i]);
              successRecord.push(rData);
            }
          } catch (e) {

            const errorObj = { record: masterDetailsDto.configuration[i], error: e }
            failureRecord.push(errorObj);
            // throw CustomException(e);
          }
          if (i == (masterDetailsDto.configuration.length - 1)) {

            const fileReport: any = {
              successCount: successRecord.length,
              successRecords: successRecord,
              failureCount: failureRecord.length,
              failureRecords: failureRecord
            }
            //end
            if (data && data.db == 'postgres') {
              await pool.end();
            } else if (data && data.db == 'mySql') {
              await connection.end();
            }

            return resolve(fileReport);

          }


        })


      }

    })
    return await foreachPromise;
    // return await model.insertMany(masterDetailsDto.configuration)

  }

  checkValidation(screenName: any, recordData: any): any {
    switch (screenName) {
      case 'S_CLAIM_9uFT3y':
        if (!recordData.claimNo || !recordData.policyNo || !recordData.vehicleRegNo
          || !recordData.vehicleNo || !recordData.surname || !recordData.dob || !recordData.forname1) {
          return { status: false, message: 'Fields can not be NULL/blank' }
        } else if (/^[a-zA-Z0-9- ]*$/.test(recordData.surname) == false ||
          /^[a-zA-Z0-9- ]*$/.test(recordData.forname1) == false) {
          return { status: false, message: 'No special characters in names field.' }
        } else {
          return { status: true }
        }
      case 'S_ADD POLICY_Lv5NOS':
        if (!recordData.policyNo || !recordData.vehicleRegNo
          || !recordData.vehicleNo || !recordData.surname || !recordData.dob || !recordData.forname1) {
          return { status: false, message: 'Fields can not be NULL/blank' }
        } else if (/^[a-zA-Z0-9- ]*$/.test(recordData.surname) == false ||
          /^[a-zA-Z0-9- ]*$/.test(recordData.forname1) == false) {
          return { status: false, message: 'No special characters in names field.' }
        } else {
          return { status: true }
        }
      case 'S_NISHCHAY_GtDr52':
        if (!recordData.gstn) {
          return { status: false, message: 'Fields can not be NULL/blank' }
        } else if (/^[a-zA-Z0-9- ]*$/.test(recordData.gstn) == false ||
          /^[a-zA-Z0-9- ]*$/.test(recordData.price) == false) {
          return { status: false, message: 'No special characters in names field.' }
        } else {
          return { status: true }
        }
      default:
        break;
    }
  }



  // Temprory method only for demo
  async addMasterPolicyClaimDetails(masterDetailsDto: MasterDetailsDto, screenName: any): Promise<any> {
    const model = await this.getModelForSchemaName(masterDetailsDto.name);
    let successRecord: any = [];
    let ignoreRecords: any = [];
    let failureRecords: any = [];
    let findObj: any = {};
    var message: any = '';

    let foreachPromise = new Promise(async (resolve, reject) => {
      for (let i = 0; i <= masterDetailsDto.configuration.length; i++) {
        try {
          switch (screenName) {
            case 'S_CLAIM_9uFT3y':
              findObj['policyNo'] = masterDetailsDto.configuration[i].policyNo;
              findObj['claimNo'] = masterDetailsDto.configuration[i].claimNo;
              message = 'Duplicate entry for policy/claim no.';
              break;
            case 'S_ADD POLICY_Lv5NOS':
              findObj['policyNo'] = masterDetailsDto.configuration[i].policyNo;
              message = 'Duplicate entry for policy no.';
              break;
            case 'S_NISHCHAY_GtDr52':
              findObj['gstn'] = masterDetailsDto.configuration[i].gstn;
              message = 'Duplicate entry for gstn';
              break;
            default:
              break;
          }
          // console.log(findObj, 'findObj findObj message message', message);
          let dataCheck = await model.find(findObj);
          if (dataCheck.length > 0) {
            let ignoreRecord: any = masterDetailsDto.configuration[i];
            ignoreRecord['reason'] = message;
            ignoreRecords.push(ignoreRecord);
          } else {
            let validationCheck: any = await this.checkValidation(screenName, masterDetailsDto.configuration[i]);
            // console.log('validationCheck validationCheck validationCheck', validationCheck)
            if (validationCheck.status) {
              let rData: any = await model.create(masterDetailsDto.configuration[i]);
              successRecord.push(rData);
            } else {
              let failedRecord: any = masterDetailsDto.configuration[i];
              failedRecord['reason'] = validationCheck.message;
              failureRecords.push(failedRecord)
            }
          }
        } catch (e) {
          // const errorObj = { record: masterDetailsDto.configuration[i], error: e }
          let failedRecord: any = masterDetailsDto.configuration[i];
          failedRecord['reason'] = e.message;
          failureRecords.push(failedRecord);
          // throw CustomException(e);
        }
        // console.log('out if condition')
        if (i == (masterDetailsDto.configuration.length - 1)) {
          // console.log('in if condition')
          const fileReport: any = {
            successCount: successRecord.length,
            successRecords: successRecord,
            ignoreRecords: ignoreRecords,
            ignoreCount: ignoreRecords.length,
            failureCount: failureRecords.length,
            failureRecords: failureRecords
          }
          return resolve(fileReport);
        }
      }
    })
    return await foreachPromise;
    // return await model.insertMany(masterDetailsDto.configuration)

  }

  async getScreenMasterDataByFilter(dataObjectWithFilter: any): Promise<any[]> {

    try {
      // let whereObj: any = { status: [null, 'Published'] };
      let whereObj: any = {};
      dataObjectWithFilter.filter_keys.forEach((element: any) => {
        if (element in dataObjectWithFilter.screen_data) {
          whereObj[element] = (dataObjectWithFilter.screen_data)[element];
        }
      });
      const model = await this.getModelForSchemaName(dataObjectWithFilter.model_name);
      return await model.find(whereObj);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async updateMasterDetails(req: any, id: string, masterDetailsDto: MasterDetailsDto): Promise<any[]> {
    try {
      const data = await this.dbconfigService.find(masterDetailsDto.name)
      if (data) {
        let existinkeys: any
        let configkeyData: any = []
        if (data.db === 'postgres') {
          const credentials = {
            user: data.user,
            host: data.host,
            database: data.database,
            password: data.password,
            port: data.port
          };
          let { Client } = require('pg');
          const client = new Client(credentials);

          await client.connect();
          if (data.existingTable == true) {
            existinkeys = data.config.reduce((accumalator, currentvalue) => {
              return ({ ...accumalator, ...currentvalue })
            }, {})
          }
          else {
            data.config.forEach(item => {
              configkeyData.push(item.key)
            })
            existinkeys = configkeyData.join()
          }
          delete masterDetailsDto.configuration["submit"];
          var query = [`UPDATE "${data.tableName}"`];
          query.push('SET');
          var set = [];
          var index: any = Number
          Object.values(existinkeys).forEach(function (key, i) {
            index = 0
            // Object.values(masterDetailsDto.configuration).map(function (key1) {
            // set.push(key + ' = $' + (i + 1));
            set.push(`"${key}" =$${i + 1}`)
            index = i + 1
          });
          query.push(set.join(', '));
          query.push('WHERE "exp_id" = $' + (index + 1) + ';');

          const values = Object.values(masterDetailsDto.configuration)
          values.push(id)
          const now = await client.query(query.join(' '), values);
          await client.end();

        } else if (data.db === 'mySql') {
          var connection: any
          connection = await mysql.createConnection({
            host: data.host,
            user: data.user,
            password: data.password,
            database: data.database
          });

          if (data.existingTable == true) {
            existinkeys = data.config.reduce((accumalator, currentvalue) => {
              return ({ ...accumalator, ...currentvalue })
            }, {})
            // existinkeys = Object.values(obj).join()
          } else {
            data.config.forEach(item => {
              configkeyData.push(item.key)
            })
            existinkeys = configkeyData.join()
          }
          await connection.connect();
          delete masterDetailsDto.configuration["submit"]
          var query = [`UPDATE ${data.tableName}`];
          query.push('SET');
          var set = [];
          Object.values(existinkeys).forEach(function (key, i) {
            set.push(`${key}=?`)
          });
          query.push(set.join(', '));
          query.push(' WHERE exp_id= ?' + ';');
          const values = Object.values(masterDetailsDto.configuration)
          values.push(id)
          const now = await connection.query(query.join(' '), values);
          await connection.end();
        }
      }
      const model = await this.getModelForSchemaName(masterDetailsDto.name);

      const resData = await model.findByIdAndUpdate({ _id: id }, masterDetailsDto.configuration);
      // const wfData = await this.workflowService.findByScreenCodeAndTriggerName(masterDetailsDto.name, 'Edit')
      // if (wfData) {
      //   await this.wfinstanceService.update(req.user, resData, wfData)
      // }
      return resData;
    } catch (e) {
      throw CustomException(e);
    }
  }



  async updateMasterDetailsStatus(targetObject: any, id: string, status: string): Promise<any> {
    const model = await this.getModelForSchemaName(targetObject);
    try {
      const resData = await model.update({ _id: id }, { $set: { 'status': status } });
      return resData;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<TDynaSchema[]> {
    try {
      return this.dynaSchemaModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getSchemaByModelName(modelName: string): Promise<TDynaSchema> {
    try {
      const schema: any = this.dynaSchemaModel.findOne({ model_name: modelName });
      return schema;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteByModalName(modelName: string): Promise<TDynaSchema> {
    try {
      const schema: any = this.dynaSchemaModel.findOneAndDelete({ model_name: modelName });
      if (!schema) {
        throw Exception();
      }
      this.removeModelFromMap(schema.model_name);
      delete mongoose.connection.models[schema.model_name];
      return schema;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<TDynaSchema> {
    try {
      const schema = await this.dynaSchemaModel.findByIdAndDelete(id);
      if (!schema) {
        throw Exception();
      }
      this.removeModelFromMap(schema.model_name);
      delete mongoose.connection.models[schema.model_name];
      return schema;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async screenFileUpload(files: any, req: any): Promise<any> {
    try {
      return new Promise(async (resolve, reject) => {
        let tutorials: any = [];
        let flag: any = true;
        let dataGridCode: any = '';
        let dataGridComponents: any = '';
        let screenData: any = await this.screenService.findByCode(req.body.screenName);
        fs.createReadStream(files[0].path)
          .pipe(parse({ headers: true })
            .on("error", (error: any) => {
              reject(new Error(error));
              // throw CustomException(error);
            })
            .on("data", (row: any) => {

              screenData.configuration[0].columns.forEach((element: any) => {
                if (flag) {
                  if (element.components.length > 0 && element.components[0].type == 'datagrid') {
                    dataGridCode = element.components[0].key;
                    dataGridComponents = element.components[0].components.length;
                    flag = false;
                  }
                }

                if (element.components[0].type == 'datetime' && row[element.components[0].key] != '' && row[element.components[0].key] != null) {
                  let dateFormateSplitArray: any = (element.components[0].format).split(" ");
                  let formatString = "";

                  dateFormateSplitArray.forEach((element: any, index: any) => {
                    if (index == 0) {
                      formatString = formatString + element.toUpperCase();
                    } else {
                      formatString = formatString + (' ') + element;
                    }
                  });
                  // console.log(row[element.components[0].key] == ' ', row[element.components[0].key].length, row[element.components[0].key], typeof row[element.components[0].key], 'row[element.components[0].key] formatString', formatString)
                  // console.log(moment(row[element.components[0].key], formatString).utcOffset("+05:30").format('MM-DD-YYYY HH:mm:ss'),
                  //   'row[element.key] = moment(row[element.key], formatString).format(MM-DD-YYYY HH:mm:ss)',
                  //   moment(row[element.components[0].key], formatString).format('MM-DD-YYYY HH:mm:ss'))
                  // row[element.components[0].key] = moment(row[element.components[0].key], formatString).utcOffset("+05:30").format('MM-DD-YYYY HH:mm:ss');
                  row[element.components[0].key] = moment(row[element.components[0].key], formatString).format('MM-DD-YYYY HH:mm:ss');

                }
              });

              if (dataGridCode != '') {
                let tempKeys = Object.keys(row).filter(key => key.startsWith(dataGridCode + "_"));
                let obj: any = {}
                let tempSlab: any = []

                tempKeys.forEach((element, index) => {
                  // element.split('_')[1]
                  if (row[element] != '' && row[element] != null) {
                    obj[element.split('_')[1]] = row[element]
                    if ((index + 1) % dataGridComponents == 0) {
                      tempSlab.push(obj);
                      obj = {};
                    }
                  }
                });
                row[dataGridCode] = tempSlab;
              }

              Object.keys(row).forEach((key: any) => {
                if (!Array.isArray(row[key]))
                  row[key] = row[key].trim()
              });
              tutorials.push(row);
            }))
          .on("end", async () => {
            let obj = { name: req.body.screenName, configuration: tutorials, screenConfig: screenData }
            if (!await this.checkCollectionExistsByName(req.body.screenName)) {
              let dynaSchemaDto = {
                modelName: req.body.screenName,
                formConfig: screenData.configuration,
                uniqueKey: req.body.uniqueKey
              }
              await this.registerSchema(dynaSchemaDto).then(async (resp1: any) => {
                await this.addMasterDetails(obj).then((resp2: any) => {
                  fs.unlinkSync(files[0].path);
                  resolve(resp2);
                  // resolve();
                }).catch((error: any) => {
                  reject(error);
                })
              }).catch((error: any) => {
                reject(error);
              })
            } else {
              await this.addMasterDetails(obj).then((resp2: any) => {
                fs.unlinkSync(files[0].path);
                resolve(resp2);
                // return resp2
              }).catch((error: any) => {
                reject(error);
              })
            }
          });
      })
    } catch (e) {
      // console.log('e', e)
      throw CustomException(e);
    }
  }

  async masterFileUpload(files: any, req: any): Promise<any> {
    try {
      return new Promise(async (resolve, reject) => {
        let tutorials: any = [];
        let masterData: any = await this.masterService.findByCode(req.body.masterName);
        fs.createReadStream(files[0].path)
          .pipe(parse({ headers: true, })
            .on("error", (error: any) => {
              reject(new Error(error));
              // throw error.message;
            })
            .on("data", (row: any) => {
              let dataGridCode: any = '';
              let dataGridComponents: any = '';
              let flag: any = true;


              masterData.configuration.forEach((element: any) => {
                if (flag) {
                  if (element.type == 'datagrid' && element.components.length > 0) {
                    dataGridCode = element.components[0].key;
                    dataGridComponents = element.components[0].components.length;
                    flag = false;
                  }
                }

                if (element.type == 'datetime' && row[element.key] != '' && row[element.key] != null) {
                  let dateFormateSplitArray: any = (element.format).split(" ");
                  let formatString = "";

                  dateFormateSplitArray.forEach((element: any, index: any) => {
                    if (index == 0) {
                      formatString = formatString + element.toUpperCase();
                    } else {
                      formatString = formatString + (' ') + element;
                    }
                  });
                  // row[element.key] = moment(row[element.key], formatString).utcOffset("+05:30").format('MM-DD-YYYY HH:mm:ss');
                  row[element.key] = moment(row[element.key], formatString).format('MM-DD-YYYY HH:mm:ss');
                }

              });
              if (dataGridCode != '') {
                let tempKeys = Object.keys(row).filter(key => key.startsWith(dataGridCode));
                let obj: any = {}
                let tempSlab: any = []
                tempKeys.forEach((element, index) => {
                  // element.split('_')[1]
                  if (row[element] != '' && row[element] != null) {
                    obj[element.split('_')[1]] = row[element]
                    if ((index + 1) % dataGridComponents == 0) {
                      tempSlab.push(obj);
                      obj = {};
                    }
                  }
                });
                row[dataGridCode] = tempSlab;
              }
              tutorials.push(row);
            }))
          .on("end", async () => {
            let obj = { name: req.body.masterName, configuration: tutorials }
            let flag = await this.checkCollectionExistsByName(req.body.masterName);
            if (!flag) {
              let dynaSchemaDto = {
                modelName: req.body.masterName,
                formConfig: masterData.configuration,
                uniqueKey: req.body.uniqueKey
              }

              await this.registerSchema(dynaSchemaDto).then(async (resp1: any) => {
                await this.addMasterDetails(obj).then((resp2: any) => {
                  fs.unlinkSync(files[0].path)
                  resolve(resp2);
                }).catch((error: any) => {
                  reject(error);
                })
              }).catch((error: any) => {
                reject(error);
              })
            } else {
              await this.addMasterDetails(obj).then((resp2: any) => {
                fs.unlinkSync(files[0].path);
                resolve(resp2);
              }).catch((error: any) => {
                reject(error);
              })
            }
          });
      })
    } catch (e) {
      // console.log('e', e)
      throw CustomException(e);
    }
  }

  async screenFileUpload1(fileOrignalName: any, objres: any, req: any): Promise<any> {
    // console.log('objres', objres, 'req', req)
    try {
      return new Promise(async (resolve, reject) => {
        let tutorials: any = [];
        let flag: any = true;
        let dataGridCode: any = '';
        let dataGridComponents: any = '';
        let screenData: any = await this.screenService.findByCode(req.body.screenName);
                        
        tutorials = objres

        let dynschemadata=await this.dynaSchemaModel.findOne({ model_name: req.body.screenName })


        const mixedProperties :any = await Object.keys(dynschemadata.schema_config).filter((property) => {
          return dynschemadata.schema_config[property].type === 'mixed';
        });
       
     _.each(tutorials,(item)=>{
      for (const [key, value] of Object.entries(item)) {
        mixedProperties.forEach((ele) => {
          if (ele == key.split("_")[0]) {
            if (!item[ele]) {
              item[ele] = [];
            }
            let number = parseInt(key.split("_")[2]);
            let subKey = key.split("_")[1];
      
            if (!item[ele][number - 1]) {
              item[ele][number - 1] = {};
            }
            item[ele][number - 1][subKey] = value;
          }
        });
      }
    }) 
        
        let obj = { name: req.body.screenName, configuration: tutorials, screenConfig: screenData.configuration[0].columns }
        // let flag = await this.checkCollectionExistsByName(req.body.screenName);
        // console.log('req.body.screenName', req.body.screenName)
        if (!await this.checkCollectionExistsByName(req.body.screenName)) {
          let dynaSchemaDto = {
            modelName: req.body.screenName,
            formConfig: screenData.configuration,
            uniqueKey: req.body.uniqueKey
          }
          // console.log('dynaSchemaDto', dynaSchemaDto)
          await this.registerSchema(dynaSchemaDto).then(async (resp1: any) => {
            await this.addMasterDetails(obj).then((resp2: any) => {
              // fs.unlinkSync(files[0].path);
              this.emailService.sendFileUploadMail(fileOrignalName, resp2, req.user);
              resolve(resp2);
              // resolve();
            }).catch((error: any) => {
              // console.log('error1', error)
              reject(error);
            })
          }).catch((error: any) => {
            // console.log('error2', error)
            reject(error);
          })
        } else {
          if (req.body.screenName === 'S_NISHCHAY_GtDr52' || req.body.screenName === 'S_CLAIM_9uFT3y' || req.body.screenName === 'S_ADD POLICY_Lv5NOS') {
            await this.addMasterPolicyClaimDetails(obj, req.body.screenName).then((resp2: any) => {
              // fs.unlinkSync(files[0].path);
              // console.log('resp2 resp2 resp2', resp2)
              this.emailService.sendFileUploadMail(fileOrignalName, resp2, req.user);
              resolve(resp2);
              // return resp2
            }).catch((error: any) => {
              // console.log('error3', error)
              reject(error);
            })
          } else {
            await this.addMasterDetails(obj).then((resp2: any) => {
              // fs.unlinkSync(files[0].path);
              this.emailService.sendFileUploadMail(fileOrignalName, resp2, req.user);
              resolve(resp2);
              // return resp2
            }).catch((error: any) => {
              // console.log('error3', error)
              reject(error);
            })
          }
        }
      })

    } catch (e) {
      // console.log('errrrrInside', e)
      throw CustomException(e);
    }
  }

  async masterFileUpload1(fileOrignalName: any, objres: any, req: any): Promise<any> {
    try {
      return new Promise(async (resolve, reject) => {
        let tutorials: any = [];
        let masterData: any = await this.masterService.findByCode(req.body.masterName);

        tutorials = objres;
        let obj = { name: req.body.masterName, configuration: tutorials }
        let flag = await this.checkCollectionExistsByName(req.body.masterName);
        if (!flag) {
          let dynaSchemaDto = {
            modelName: req.body.masterName,
            formConfig: masterData.configuration,
            uniqueKey: req.body.uniqueKey
          }
          await this.registerSchema(dynaSchemaDto).then(async (resp1: any) => {
            await this.addMasterDetails(obj).then((resp2: any) => {
              // fs.unlinkSync(files[0].path)
              this.emailService.sendFileUploadMail(fileOrignalName, resp2, req.user);
              resolve(resp2);
            }).catch((error: any) => {
              reject(error);
            })
          }).catch((error: any) => {
            reject(error);
          })
        } else {
          await this.addMasterDetails(obj).then((resp2: any) => {
            // fs.unlinkSync(files[0].path);
            this.emailService.sendFileUploadMail(fileOrignalName, resp2, req.user);
            resolve(resp2);
          }).catch((error: any) => {
            reject(error);
          })
        }
      })
    } catch (e) {
      throw CustomException(e);
    }
  }

  // Api for contract screens

  async getContractListByDateFilter(masterName: string, filterValue: number): Promise<TDynaSchema[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {
      var d = new Date();
      d.setDate(d.getDate() + filterValue);
      return await model.find({ 'contractEndDt': { $gte: moment(), $lt: moment().add(filterValue, 'days') } });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getContractListByMaxNumToTop(masterName: string): Promise<TDynaSchema[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {

      return await model.aggregate([
        {
          $match: {
            "contractEndDt": { "$gte": new Date() }
          }
        },
        { $group: { _id: { "custNameMsa": "$custNameMsa" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        {
          "$project": {
            "_id": 0,
            "custNameMsa": "$_id.custNameMsa",
            "count": 1
          }
        }
      ])
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getContractListByPriceTypeCount(masterName: string): Promise<TDynaSchema[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {

      return await model.aggregate([
        {
          $match: {
            "contractEndDt": { "$gte": new Date() }
          }
        },
        { $group: { _id: { "prdName": "$prdName", "indPriceType": "$indPriceType" }, indPriceTypeCount: { $sum: 1 } } },
        {
          "$project": {
            "_id": 0,
            "prdName": "$_id.prdName",
            "indPriceType": "$_id.indPriceType",
            "indPriceTypeCount": 1
          }
        }

      ]);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getContractListByPriceCalculation(masterName: string): Promise<TDynaSchema[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {

      return await model.aggregate([
        {
          $match: {
            "contractEndDt": { "$gte": new Date() },
            'indPriceType': { '$ne': 'fixedBill' }
          }
        },
        {
          $addFields: {
            "Price": {
              $function: {
                body: `function (slab, indPriceType, fixedBillAmt) {
                if (fixedBillAmt != null && fixedBillAmt != '') {
                  return fixedBillAmt;
                } else {
                  var sum = 0;
                  if(slab){
                  slab.map(s => {
                    if (s.price !== '') {
                      sum = sum + (parseFloat(s.to) - parseFloat(s.from)) * parseFloat(s.price);
                    }
                  })
                }
                  return sum> 0  && (sum/500000000).toFixed(2);
                }
              }`,
                args: ["$slab", "$indPriceType", "$fixedBillAmt"],
                lang: "js"
              }
            },
            "Duration": {
              $function: {
                body: `function(contractStartDt, contractEndDt) {
                     return (contractEndDt - contractStartDt)/( 1000 * 60 * 60 * 24 );
                 }`,
                args: ["$contractStartDt", "$contractEndDt"],
                lang: "js"

              }
            }
          }
        }
      ]);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getContractListByProductCount(masterName: string): Promise<TDynaSchema[]> {
    const model = await this.getModelForSchemaName(masterName);
    try {

      return await model.aggregate([
        {
          $match: {
            "contractEndDt": { "$gte": new Date() }
          }
        },
        { $group: { _id: { "custNameMsa": "$custNameMsa", "prdName": "$prdName" }, prdNameCount: { $sum: 1 } } },
        {
          "$project": {
            "_id": 0,
            "custNameMsa": "$_id.custNameMsa",
            "prdName": "$_id.prdName",
            "prdNameCount": 1,
          }
        }

      ]);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getjsonRes(file: any, req: any): Promise<TDynaSchema[]> {

    try {
      var fs = require("fs");
      let csvBuffer = Buffer.from(file['buffer'], 'base64');
      let csvText = csvBuffer.toString('ascii');
      const res = await csv().fromString(csvText);
      return res;
    } catch (e) {
      throw CustomException(e);
    }
  }


  async getjsonResRR(file: any, req: any): Promise<TDynaSchema[]> {
    try {
      // var URL = 'http://50.16.16.62:8081/uploader'
      var fs = require("fs");
      let buffer = Buffer.from(file['buffer'], 'base64');
      const FormData = require('form-data');
      const form = new FormData();

      // const buffer = // e.g. `fs.readFileSync('./fileLocation');
      // const fileName = 'test.txt';

      form.append('file', buffer, {
        // contentType: 'text/plain',
        name: 'file',
        filename: file.originalname,
      });

      // fetch('https://httpbin.org/post', { method: 'POST', body: form })
      // console.log('files', file, 'req', req)
      const res: any = await fetch('http://50.16.16.62:8081/uploader', { method: 'POST', body: form });
      // const res : any = await fetch(URL) //option.apiinterface_data.url, option.apiinterface_data.option
      const data = await res.json()
      return data;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getClaimByDOB(filterObj: any): Promise<any> {
    try {
      const model = await this.getModelForSchemaName("S_CLAIM_9uFT3y");

      return await model.find(filterObj)
    } catch (e) {

    }
  }

  async getJoinData(filterObj: any): Promise<any> {
    var x = Object.keys(filterObj);
    try {
      const model = await this.getModelForSchemaName("S_ADD POLICY_Lv5NOS"); //M_POLICY_hCj4CH
      if (x[0] == 'policyNo') {
        return await model.aggregate([
          { "$match": { "policyNo": filterObj.policyNo } },
          {
            $lookup:
            {
              from: 's_claim_9uft3ies', //S_CLAIM_9uFT3y //m_claim_hhywjzs
              localField: 'policyNo',
              foreignField: 'policyNo',
              as: 'claims'
            }
          }
        ])
      } else if (x[0] == 'rsaId') {
        return await model.aggregate([
          { "$match": { "rsaId": filterObj.rsaId } },
          {
            $lookup:
            {
              from: 's_claim_9uft3ies',
              localField: 'rsaId',
              foreignField: 'rsaId',
              as: 'claims'
            }
          }
        ])
      }
    } catch (e) {
      // throw CustomException(e);
    }
  }

}
