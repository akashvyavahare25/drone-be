import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { ReportDto, Report } from './report.interface';
import { DynaSchemaService } from '../dynaschema/dynaschema.service';
import _ = require('lodash');

@Injectable()
export class ReportService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
  ) { }

  async create(report: ReportDto): Promise<Report> {
    try {
      return await this.reportModel.create(report);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, Report: ReportDto): Promise<any> {
    try {
      return await this.reportModel.update({ _id: id }, Report);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Report> {
    try {
      const report = await this.reportModel.findById(id);
      if (!report) {
        throw Exception();
      }
      return report;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Report> {
    try {
      const report = await this.reportModel.findByIdAndDelete(id);
      if (!report) {
        throw Exception();
      }
      return report;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Report[]> {
    try {
      return await this.reportModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getFunctionByName(name: string): Promise<Report> {
    try {
      const report = await this.reportModel.findOne({ name: name });
      if (!report) {
        throw Exception();
      }
      return report;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getReportByScreenData(screenData: any): Promise<any> {
    try {
      return await this.reportModel.find({ screenData: screenData });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async queryTestPublic(report: any): Promise<any> {
   
    console.log('/jkljhgjk', report);
    const model = await this.dynaSchemaService.getModelForSchemaName(report.screenData.code);

    try {
      switch (report.queryType) {
        case 'find':
          return await model.find(report.config)
        case 'aggregate':
          console.log('report config', report.config)
          var k: any = []
          k= JSON.parse(report.config);
          return await model.aggregate(k)
        case 'aggregate+field':
          let aggrArray: any = []
          var r, l, g, p : any = []
          r= JSON.parse(report.config);
          console.log('1', r)
          // l= JSON.parse(report.lookupFields);
          // console.log('2')
          // g= JSON.parse(report.groupFields);
          // console.log('3')
          // p= JSON.parse(report.projectFields);
          console.log('4')
          console.log('r', r, 'l', l, 'g', g, 'p', p)
          if(r !== null || r !== undefined){

          if (Object.keys(r).length > 0) {
            console.log('kjsahks')
            aggrArray.push({
              $match: r
            })
          }
        }

        if(report.lookupFields !== null || report.lookupFields !== undefined){
          if (Object.keys(report.lookupFields).length > 0) {
            aggrArray.push({
              $lookup: report.lookupFields
            })
          }
        }

        if(report.groupFields !== null || report.groupFields !== undefined){
          console.log('ajsgjgja', Object.keys(report.groupFields))
          if (Object.keys(report.groupFields).length > 0) {
            let groupFields = JSON.stringify(report.groupFields).replace('___', '$');
            groupFields = JSON.parse(groupFields);
            aggrArray.push({
              $group: groupFields
            })
            console.log('groupFields', groupFields)
          }
        }

        if(report.projectFields !== null || report.projectFields !== undefined){

          if (Object.keys(report.projectFields).length > 0) {
            aggrArray.push({
              $project: report.projectFields
            })
          }

        }

        if(report.addFields !== null || report.addFields !== undefined){
          if (report.addFields.length > 0) {
            let obj: any = {};
            report.addFields.forEach((element: any) => {
              // let arg = element.function.arg.map((val: any) => '$' + val);
              obj[element.property] = {
                $function: {
                  body: element.function.body,
                  args: element.function.arg,
                  lang: "js"
                }
              }
            });
            aggrArray.push({
              $addFields: obj
            })
          }
        }
          console.log('aggrArrayaggrArray', aggrArray);
          return await model.aggregate(aggrArray)
        default:
          break;
      }
    } catch (e) {
      console.log('e test123', e)
      throw CustomException(e);
    }
  }

  async queryTest(report: any): Promise<any> {
    const model = await this.dynaSchemaService.getModelForSchemaName(report.screenData.code);

    try {
      switch (report.queryType) {
        case 'find':
          return await model.find(report.config)
        case 'aggregate':
          return await model.aggregate(report.config)
        case 'aggregate+field':
          let aggrArray: any = []
          if (Object.keys(report.config).length > 0) {
            aggrArray.push({
              $match: report.config
            })
          }
          if (Object.keys(report.lookupFields).length > 0) {
            aggrArray.push({
              $lookup: report.lookupFields
            })
          }
          if (Object.keys(report.groupFields).length > 0) {
            let groupFields = JSON.stringify(report.groupFields).replace('___', '$');
            groupFields = JSON.parse(groupFields);
            aggrArray.push({
              $group: groupFields
            })
          }
          if (Object.keys(report.projectFields).length > 0) {
            aggrArray.push({
              $project: report.projectFields
            })
          }

          if (report.addFields.length > 0) {
            let obj: any = {};
            report.addFields.forEach((element: any) => {
              // let arg = element.function.arg.map((val: any) => '$' + val);
              obj[element.property] = {
                $function: {
                  body: element.function.body,
                  args: element.function.arg,
                  lang: "js"
                }
              }
            });
            aggrArray.push({
              $addFields: obj
            })
          }
          return await model.aggregate(aggrArray)
        default:
          break;
      }
    } catch (e) {
      throw CustomException(e);
    }
  }
}
