import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { RulesDto, Rules } from './rules.interface';
import { DynaSchemaService } from 'src/dynaschema/dynaschema.service';

@Injectable()
export class RulesService {
  constructor(
    @InjectModel('Rules') private readonly rulesModel: Model<Rules>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
  ) { }

  async create(rules: RulesDto): Promise<Rules> {
    try {
      return await this.rulesModel.create(rules);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, Rules: RulesDto): Promise<any> {
    try {
      return await this.rulesModel.update({ _id: id }, Rules);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Rules> {
    try {
      const rules = await this.rulesModel.findById(id);
      if (!rules) {
        throw Exception();
      }
      return rules;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreenCode(dataset: string): Promise<Rules[]> {
    try {
      return  await this.rulesModel.find({dataset:dataset});
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Rules> {
    try {
      const rules = await this.rulesModel.findByIdAndDelete(id);
      if (!rules) {
        throw Exception();
      }
      return rules;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Rules[]> {
    try {
      return await this.rulesModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getFunctionByName(name: string): Promise<Rules> {
    try {
      const rules = await this.rulesModel.findOne({ name: name });
      if (!rules) {
        throw Exception();
      }
      return rules;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getRulesByScreenData(screenData: any): Promise<any> {
    try {
      return await this.rulesModel.find({ screenData: screenData });
    } catch (e) {
      throw CustomException(e);
    }
  }

  async queryTestPublic(rules: any): Promise<any> {

    console.log('/jkljhgjk', rules);
    const model = await this.dynaSchemaService.getModelForSchemaName(rules.screenData.code);

    try {
      switch (rules.queryType) {
        case 'find':
          return await model.find(rules.config)
        case 'aggregate':
          console.log('rules config', rules.config)
          var k: any = []
          k = JSON.parse(rules.config);
          return await model.aggregate(k)
        case 'aggregate+field':
          let aggrArray: any = []
          var r, l, g, p: any = []
          r = JSON.parse(rules.config);
          console.log('1', r)
          // l= JSON.parse(rules.lookupFields);
          // console.log('2')
          // g= JSON.parse(rules.groupFields);
          // console.log('3')
          // p= JSON.parse(rules.projectFields);
          console.log('4')
          console.log('r', r, 'l', l, 'g', g, 'p', p)
          if (r !== null || r !== undefined) {

            if (Object.keys(r).length > 0) {
              console.log('kjsahks')
              aggrArray.push({
                $match: r
              })
            }
          }

          if (rules.lookupFields !== null || rules.lookupFields !== undefined) {
            if (Object.keys(rules.lookupFields).length > 0) {
              aggrArray.push({
                $lookup: rules.lookupFields
              })
            }
          }

          if (rules.groupFields !== null || rules.groupFields !== undefined) {
            console.log('ajsgjgja', Object.keys(rules.groupFields))
            if (Object.keys(rules.groupFields).length > 0) {
              let groupFields = JSON.stringify(rules.groupFields).replace('___', '$');
              groupFields = JSON.parse(groupFields);
              aggrArray.push({
                $group: groupFields
              })
              console.log('groupFields', groupFields)
            }
          }

          if (rules.projectFields !== null || rules.projectFields !== undefined) {

            if (Object.keys(rules.projectFields).length > 0) {
              aggrArray.push({
                $project: rules.projectFields
              })
            }

          }

          if (rules.addFields !== null || rules.addFields !== undefined) {
            if (rules.addFields.length > 0) {
              let obj: any = {};
              rules.addFields.forEach((element: any) => {
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

  async queryTest(rules: any): Promise<any> {
    const model = await this.dynaSchemaService.getModelForSchemaName(rules.screenData.code);

    try {
      switch (rules.queryType) {
        case 'find':
          return await model.find(rules.config)
        case 'aggregate':
          return await model.aggregate(rules.config)
        case 'aggregate+field':
          let aggrArray: any = []
          if (Object.keys(rules.config).length > 0) {
            aggrArray.push({
              $match: rules.config
            })
          }
          if (Object.keys(rules.lookupFields).length > 0) {
            aggrArray.push({
              $lookup: rules.lookupFields
            })
          }
          if (Object.keys(rules.groupFields).length > 0) {
            let groupFields = JSON.stringify(rules.groupFields).replace('___', '$');
            groupFields = JSON.parse(groupFields);
            aggrArray.push({
              $group: groupFields
            })
          }
          if (Object.keys(rules.projectFields).length > 0) {
            aggrArray.push({
              $project: rules.projectFields
            })
          }

          if (rules.addFields.length > 0) {
            let obj: any = {};
            rules.addFields.forEach((element: any) => {
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
