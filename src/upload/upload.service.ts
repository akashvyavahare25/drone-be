import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from 'src/common/exceptions';
import { UploadDto, Upload } from './upload.interface';
import { DynaSchemaService } from 'src/dynaschema/dynaschema.service';
import { ScreenService } from 'src/screen/screen.service';
var csv=require("csvtojson");
import fetch from 'node-fetch';
import { parse } from '@fast-csv/parse';
import * as moment from 'moment';

@Injectable()
export class UploadService {
 
  constructor(
    @InjectModel('Upload') private readonly uploadModel: Model<Upload>,
    @Inject(forwardRef(() => DynaSchemaService))
    private dynaSchemaService: DynaSchemaService,
    @Inject(forwardRef(() => ScreenService))
    private screenService: ScreenService,
    ) { }
  

  async create(upload: UploadDto): Promise<Upload> {
    try {
      return await this.uploadModel.create(upload);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, Upload: UploadDto): Promise<any> {
    try {
      return await this.uploadModel.update({ _id: id }, Upload);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Upload> {
    try {
      const upload = await this.uploadModel.findById(id);
      if (!upload) {
        throw Exception();
      }
      return upload;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Upload> {
    try {
      const upload = await this.uploadModel.findByIdAndDelete(id);
      if (!upload) {
        throw Exception();
      }
      return upload;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Upload[]> {
    try {
      return await this.uploadModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findByScreen(id: string): Promise<Upload> {
    try {
      console.log("id", id)
      const upload = await this.uploadModel.findOne({screenName: id});
      // console.log(upload)
      if (!upload) {
        throw Exception();
      }
      return upload;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getjsonRes(file: any, req: any): Promise<Upload> {
    // console.log('file', file)
    try {
      var fs = require("fs");
      let csvBuffer = Buffer.from(file['buffer'], 'base64');
      // console.log('csvBuffer', csvBuffer);
      let csvText = csvBuffer.toString('ascii');
      // console.log('csvText', csvText);
      const res = await csv().fromString(csvText);
      // console.log('res', res);
      return res;
    } catch (e) {
        // console.log('s', e);
        throw CustomException(e);
    }
  }

  // async getjsonRes1(file: any, req: any): Promise<Upload> {
  //   console.log('file+++++++++++', file, 'req+++++++', req, 'path++++++++++++', file.path)
  //   var fs = require("fs");
  //   var res: any;
  //   try {
  //     return new Promise(async (resolve, reject) => {
  //       let tutorials: any = [];
  //       let flag: any = true;
  //       let dataGridCode: any = '';
  //       let dataGridComponents: any = '';
  //       let screenData: any = await this.screenService.findByCode(req.body.screenName);
  //       fs.createReadStream(file.path)
  //         .pipe(parse({ headers: true, skipLines: 1 })
  //           .on("error", (error: any) => {
  //             console.log('@@+++++++++++++++++', error)
  //             reject(new Error(error));
  //             // throw CustomException(error);
  //           })
  //           .on("data", (row: any) => {

  //             screenData.configuration[0].columns.forEach((element: any) => {
  //               if (flag) {
  //                 if (element.components.length > 0 && element.components[0].type == 'datagrid') {
  //                   dataGridCode = element.components[0].key;
  //                   dataGridComponents = element.components[0].components.length;
  //                   flag = false;
  //                 }
  //               }

  //               if (element.components[0].type == 'datetime' && row[element.components[0].key] != '' && row[element.components[0].key] != null) {
  //                 let dateFormateSplitArray: any = (element.components[0].format).split(" ");
  //                 let formatString = "";

  //                 dateFormateSplitArray.forEach((element: any, index: any) => {
  //                   if (index == 0) {
  //                     formatString = formatString + element.toUpperCase();
  //                   } else {
  //                     formatString = formatString + (' ') + element;
  //                   }
  //                 });
  //                 row[element.components[0].key] = moment(row[element.components[0].key], formatString).format('MM-DD-YYYY HH:mm:ss');

  //               }
  //             });

  //             if (dataGridCode != '') {
  //               let tempKeys = Object.keys(row).filter(key => key.startsWith(dataGridCode + "_"));
  //               let obj: any = {}
  //               let tempSlab: any = []

  //               tempKeys.forEach((element, index) => {
  //                 // element.split('_')[1]
  //                 if (row[element] != '' && row[element] != null) {
  //                   obj[element.split('_')[1]] = row[element]
  //                   if ((index + 1) % dataGridComponents == 0) {
  //                     tempSlab.push(obj);
  //                     obj = {};
  //                   }
  //                 }
  //               });
  //               row[dataGridCode] = tempSlab;
  //             }

  //             Object.keys(row).forEach((key: any) => {
  //               if (!Array.isArray(row[key]))
  //                 row[key] = row[key].trim()
  //             });
  //             tutorials.push(row);
  //           }))
  //         .on("end", async () => {
  //           // const csvFilePath= file.path
  //           //   const csv=require('csvtojson')
  //           //   csv()
  //           //   .fromFile(csvFilePath)
  //           //   .then((jsonObj: any)=>{
  //           //     console.log('result', jsonObj); 
  //           //   })
  //           // fs.unlinkSync(file.path);
  //           let obj = { name: req.body.screenName, configuration: tutorials }
  //           // let flag = await this.checkCollectionExistsByName(req.body.screenName);
  //           if (!await this.dynaSchemaService.checkCollectionExistsByName(req.body.screenName)) {
  //             let dynaSchemaDto = {
  //               modelName: req.body.screenName,
  //               formConfig: screenData.configuration,
  //               uniqueKey: req.body.uniqueKey
  //             }
  //             // await this.dynaSchemaService.registerSchema(dynaSchemaDto).then(async (resp1: any) => {
  //             //   await this.dynaSchemaService.addMasterDetails(obj).then((resp2: any) => {
  //                 fs.unlinkSync(file.path);
  //             //     resolve(resp2);
  //             //     // resolve();
  //             //   }).catch((error: any) => {
  //             //     reject(error);
  //             //   })
  //             // }).catch((error: any) => {
  //             //   reject(error);
  //             // })
  //           } else {
  //             // await this.dynaSchemaService.addMasterDetails(obj).then((resp2: any) => {
  //               fs.unlinkSync(file.path);
  //             //   resolve(resp2);
  //             //   // return resp2
  //             // }).catch((error: any) => {
  //             //   reject(error);
  //             // })
  //           }
            
  //         });
  //     })

  //     // return res;
  //   } catch (e) {
  //     throw CustomException(e);
  //   }
  // }


  async getjsonResRR(file: any, req: any): Promise<Upload> {
    try{
      var fs = require("fs");
      let buffer = Buffer.from(file['buffer'], 'base64');
      const FormData = require('form-data');     
      const form = new FormData();

      form.append('file', buffer, {
        name: 'file',
        filename: file.originalname,
      });
      // http://50.16.16.62:8081/uploader'      http://localhost:7070/rruploader/ http://localhost:7070/rcuploader/
      const res : any = await fetch('http://50.16.16.62:8081/rruploader/', {method: 'POST', body: form});
      const data = await res.json()
      return data;
    } catch (e) {
        throw CustomException(e);
    }
  }

  async getjsonResRC(file: any, req: any): Promise<Upload> {
    try{
      var fs = require("fs");
      let buffer = Buffer.from(file['buffer'], 'base64');
      const FormData = require('form-data');     
      const form = new FormData();

      form.append('file', buffer, {
        name: 'file',
        filename: file.originalname,
      });
      const res : any = await fetch('http://50.16.16.62:8081/rcuploader/', {method: 'POST', body: form});
      const data = await res.json()
      return data;
    } catch (e) {
        throw CustomException(e);
    }
  }

}
