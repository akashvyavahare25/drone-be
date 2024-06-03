import { Controller, Get, Post, Req, Res, Param, UseGuards, Body, Delete, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FilesInterceptor, MulterModule } from '@nestjs/platform-express'
import { DynaSchemaService } from './dynaschema.service';
//import { ApiUseTags } from '@nestjs/swagger';
import { DynaSchemaDto, TDynaSchema } from './dynaschema.interface';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { MasterDetailsDto } from '../master/master.interface';
import { ScreenService } from '../screen/screen.service';
import { MasterService } from '../master/master.service';
import { UploadService } from 'src/upload/upload.service';
import { createObjectCsvWriter } from 'csv-writer';
import { Readable } from 'stream';

const CsvParser = require("json2csv").Parser;
var fs = require('fs');
import { parse } from '@fast-csv/parse';
import { LoggingInterceptor } from '../common/interceptor';
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('api')
export class DynaSchemaController {

  constructor(private readonly dynaSchemaService: DynaSchemaService,
    private readonly screenService: ScreenService, private readonly masterService: MasterService,
    private readonly uploadService: UploadService) { }

  @Post('schema')
  registerSchema(@Req() req: Request, @Body() dynaSchemaDto: DynaSchemaDto) {
    return this.dynaSchemaService.registerSchema(dynaSchemaDto);
  }

  @Get('schema')
  @Roles('admin')
  getAllSchema(@Req() req: Request, @Body() document: any): Promise<TDynaSchema[]> {
    return this.dynaSchemaService.getAll();
  }

  @Delete('schema/:id')
  async deleteSchema(@Param('id') schemaId: string): Promise<TDynaSchema> {
    return this.dynaSchemaService.deleteById(schemaId);
  }

  @Get('schema/list/:masterName/:type/:appName')
  async getMasterDetailListByName(@Req() req: Request, @Param('masterName') masterName: string, @Param('type') type: string, @Param('appName') appName: string): Promise<any[]> {
    return this.dynaSchemaService.getMasterDetailListByNameAndCode(masterName, req.user, type, appName);
  }


  @Get('schema/:masterName')
  async getSchemaByModelName(@Param('masterName') masterName: string): Promise<TDynaSchema> {
    return this.dynaSchemaService.getSchemaByModelName(masterName);
  }

  @Post('screen-master')
  async getScreenMasterDataByFilter(@Req() req: Request, ): Promise<any[]> {
    return this.dynaSchemaService.getScreenMasterDataByFilter(req.body.data);
  }

  @Get('schema/exists/:masterName')
  async checkCollectionExistsByName(@Param('masterName') masterName: string): Promise<boolean> {
    return this.dynaSchemaService.checkCollectionExistsByName(masterName);
  }

  @Get('schema/:masterName/:id')
  async getMasterDetails(@Param('masterName') masterName: string, @Param('id') schemaId: string): Promise<any> {
    return this.dynaSchemaService.getByNameAndId(masterName, schemaId);
  }
  @Get('schema/screen/:screen/:id')
  async getScreenDetails(@Param('screen') screen: string, @Param('id') schemaId: string,@Req() req: Request): Promise<any> {
    return this.dynaSchemaService.getScreenDataByNameAndId(screen, schemaId,req.user);
  }
  @Delete('schema/:masterName/:id')
  async deleteSchemaRecord(@Param('masterName') masterName: string, @Param('id') schemaId: string): Promise<any> {
    return this.dynaSchemaService.deleteSchemaRecord(masterName, schemaId);
  }

  @Post('schema/create')
  async addMasterDetail(@Req() req: Request, @Body() masterDetailsDto: MasterDetailsDto): Promise<any> {
    return this.dynaSchemaService.addMasterDetail(req, masterDetailsDto);
  }

  @Put('schema/update/:id')
  async updateMasterDetails(@Req() req: Request, @Param('id') id: string, @Body() masterDetailsDto: MasterDetailsDto): Promise<any> {
    return this.dynaSchemaService.updateMasterDetails(req, id, masterDetailsDto);
  }

  @Get('joins/:type/:typevalue')
  async getJointschema(@Param('type') type: string, @Param('typevalue') typevalue: string): Promise<any> {
    return this.dynaSchemaService.getJointschema(type, typevalue);
  }

  @Get('claim/:claimclm/:claimvalue')
  async getJointClaimschema(@Param('claimclm') claimclm: string, @Param('claimvalue') claimvalue: string): Promise<any> {
    return this.dynaSchemaService.getJointClaimschema(claimclm, claimvalue);
  }

  @Get('lookup/master/:masterName')
  async getMasterDetailsForDropdown(@Req() req: Request, @Param('masterName') masterName: string): Promise<any> {
    return this.dynaSchemaService.getDropdownData(masterName, req.query);
  }

  @Get('lookup/screen/:screenName')
  async getScreenDetailsForDropdown(@Param('screenName') screenName: string): Promise<any> {
    return this.dynaSchemaService.getDropdownDataScreen(screenName);
  }

  @Get('query/master/:mastNameQuey')
  async getMasterData(@Req() req: Request, @Param('mastNameQuey') mastNameQuey: string): Promise<any> {
    return this.dynaSchemaService.getMasterDataBE(mastNameQuey, req.query);
  }

  @Get('query/screen/:screenNameQuey')
  async getScreenDetailsForDropdown1(@Req() req: Request, @Param('screenNameQuey') screenNameQuey: string): Promise<any> {
    return this.dynaSchemaService.getScreenDataBE(screenNameQuey, req.query);
  }

  @Get('/gen-template/:type/:masterName/:id')
  async generateTemplet(@Param('type') type: string,
    @Param('masterName') masterName: string, @Param('id') schemaId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
    let csvFields: any = [];
    let csvLables: any = [];
    if (type == 'screen') {
      const screenData: any = await this.screenService.findByCodeAndId(masterName, schemaId);
      screenData.configuration[0].columns.forEach((element: any) => {
        if (element.components.length > 0) {
          element.components.forEach((subElement: any) => {
            if (subElement.type == 'datagrid' && subElement.components.length > 0) {
              subElement.components.forEach((innerSubElement: any, index: any) => {
                // csvFields.push(subElement.key + "_" + innerSubElement.key + "_1")
                csvLables.push(subElement.key + "_" + innerSubElement.key)
              });
            } else {
              // csvFields.push(subElement.key)
              csvLables.push(subElement.key)
            }
          });
        }
      });
    } else {
      const masterData: any = await this.masterService.findByCodeAndId(masterName, schemaId);
      masterData.configuration.forEach((subElement: any) => {
        if (subElement.type == 'datagrid' && subElement.components.length > 0) {
          subElement.components.forEach((innerSubElement: any, index: any) => {
            // csvFields.push(subElement.key + "_" + innerSubElement.key + "_1")
            csvLables.push(subElement.key + "_" + innerSubElement.key)
          });
        } else {
          // csvFields.push(subElement.key)
          csvLables.push(subElement.key)
        }
      });
    }

    const csvParser = new CsvParser({ csvLables });
    let obj: any = {};
    // obj[csvLables[0]] = ''
    csvLables.forEach((element: any, index: any) => {
      obj[element] = csvFields[index]
    });
    const csvData = csvParser.parse([obj]);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=" + masterName + ".csv");

    return res.status(200).end(csvData);;
  }

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: any, @Req() req: Request, @Res() res: any) {
    try {
      if (files == undefined) {
        return res.status(400).send("Please upload a CSV file!");
      }
      let reportData: any;
      if (req.body.type == 'screen') {
        await this.dynaSchemaService.screenFileUpload(files, req).then((resp: any) => {
          reportData = resp;
        });
      } else {
        await this.dynaSchemaService.masterFileUpload(files, req).then((resp: any) => {
          reportData = resp
        });
      }
      // return reportData;
      res.status(200).json({
        status: 200,
        reportData: reportData,
        message:
          "Uploaded the file successfully: " + files[0].originalname,
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: error + "Could not upload the file: " + files[0].originalname,
      });
    }
  }



  @Get('/gen-template-data/:type/:masterName/:id/:appName')
  async generateTempletWithDatahr(@Param('type') type: string, @Param('masterName') masterName: string, @Param('id') schemaId: string, @Req() req: Request, @Res() res: Response, @Param('appName') appName: string): Promise<any> {
    let tempCsvData: any = [];
    // let headers = new Map<string, string>();
    let headers = new Set<string>();
    let headerIndex = 0;

    const screenData = await this.screenService.findByCode(masterName);
    const staticHeaders = await this.uploadService.findByScreen(screenData.name);
    const CsvHeaders = staticHeaders.config;
    const transformedHeaders = Object.keys(CsvHeaders).map((key) => {
      let header = CsvHeaders[key];
      header = header.replace(/([a-zA-Z]+)\.(\d+)\.([a-zA-Z]+)/, (_, prefix, number, suffix) => `${prefix}_${suffix}_${Number(number) + 1}`);
      return header;
    });

    const masterScreenTableData: any = await this.dynaSchemaService.getMasterDetailListByNameAndCode(masterName, req.user, type, appName);
    masterScreenTableData.forEach((me: any, mi: any) => {
      let obj1: any = {};
      Object.keys(me.toJSON()).forEach((e: any, i: any) => {
        if (e != '__v' && e != '_id') {
          if (Array.isArray(me[e])) {
            const subHeaders = [];
            me[e].forEach((se: any, si: any) => {
              Object.keys(se).forEach((sse: any, ssi: any) => {
                if (sse != '__v' && sse != '_id') {
                  const key = e + "_" + sse + "_" + (si + 1);
                  subHeaders.push(key);
                  obj1[key] = se[sse];
                }
              });
            });
            subHeaders.sort().forEach((key) => {
              // if (!headers.has(key)) {
              //     headers.set(headerIndex.toString(), key);
              //     headerIndex++;
              // }
              headers.add(key);
            });
          } else {
            // if (!headers.has(e)) {
            //     headers.set(headerIndex.toString(), e);
            //     headerIndex++;
            // }
            headers.add(e);
            obj1[e] = me[e];
          }
        }
      });
      tempCsvData.push(obj1);
    });

    const orderedHeaders = transformedHeaders.filter((header) => headers.has(header));
 

    transformedHeaders.forEach(header => {
      for (const [key, value] of headers) {
        if (key.includes(header)) {
          orderedHeaders.push(value);
          break;
        }
      }
    });
    const headerSet = [...headers]
    // console.log("ordered", orderedHeaders)
    const csvData = [orderedHeaders.join(',')];
  
    for (const data of tempCsvData) {
      const values = orderedHeaders.map(header => data[header]);
      csvData.push(values.join(','));
    }
  
    const csvContent = csvData.join('\n');

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=" + masterName + ".csv");

    // return res.status(200).end(csvData);
    return res.status(200).send(csvContent);

  }



  // Api for contract screens


  @Get('contract-data/:masterName/:filterValue')
  async getContractListByDateFilter(@Param('masterName') masterName: string, @Param('filterValue') filterValue: number): Promise<any[]> {
    return this.dynaSchemaService.getContractListByDateFilter(masterName, filterValue);
  }

  @Get('contract-max-top/:masterName')
  async getContractListByMaxNumToTop(@Param('masterName') masterName: string): Promise<any[]> {
    return this.dynaSchemaService.getContractListByMaxNumToTop(masterName);
  }

  @Get('contract-product-count/:masterName')
  async getContractListByProductCount(@Param('masterName') masterName: string): Promise<any[]> {
    return this.dynaSchemaService.getContractListByProductCount(masterName);
  }

  @Get('contract-count/:masterName')
  async getContractListByPriceTypeCount(@Param('masterName') masterName: string): Promise<any[]> {
    return this.dynaSchemaService.getContractListByPriceTypeCount(masterName);
  }

  @Get('contract-price-variance/:masterName')
  async getContractListByPriceCalculation(@Param('masterName') masterName: string): Promise<any[]> {
    return this.dynaSchemaService.getContractListByPriceCalculation(masterName);
  }


  @Post('claim/dob')
  async getClaimByDOB(@Body() filterObj: any): Promise<any[]> {
    return this.dynaSchemaService.getClaimByDOB(filterObj);
  }

  @Post('joins/policy')
  async getJoinData(@Body() filterObj: any): Promise<any[]> {
    return this.dynaSchemaService.getJoinData(filterObj);
  }
}
