import { Model } from 'mongoose';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception, CustomException } from '../common/exceptions';
import { FtpDto, Ftp } from './ftp.interface';
import { UploadtemplateService } from '../filetransfer/uploadtemplate.service'
let Client = require('ssh2-sftp-client');
let sftp = new Client();
var fs = require("fs");
import fetch from 'node-fetch';

const tempObj = {

  // "source_path": "file:/tmp/data/inbound/claim_data.csv",

  // "target_path": "file:/tmp/data/outbound/target_test.csv",
  "source_path": "file:/tmp/data/inbound/60a20ba30d6964a24602c063_claim_data1.csv",

  "target_path": "ffile:/tmp/data/outbound/60a20ba30d6964a24602c063_claim_data1.csv",

  "format": "csv",

  "delimiter": ",",

  "Filter": "First_Name LIKE('%Ji%') AND ( Gender = 'S' OR Marital_Status = 'M' OR Hour NOT IN(3) )  AND Amount_of_Claim_Reserve != 0",

  "DropUnusedFields": [

    "Identification Document Number for driver",

    "Service Provider Type",

    "Service Provider Address",

    "Service Beneficiary Name"

  ],

  "Rename": [

    "('Marital Status','Marital_Status')",

    "('First Name','First_Name')",

    "('Middle Name','Middle_Name')",

    "('Maiden Name','Maiden_Name')",

    "('Amount Paid','Amount_Paid')",

    "('Amount of Claim Reserve','Amount_of_Claim_Reserve')",

    "('Date of Payment of Last Premium','Date_of_Payment_of_Last_Premium')"

  ],

  "DefaultVaue": [

    "('Marital_Status','Single')",

    "('Gender','Male')"

  ],

  "Transform": [

    // "('Marital_Status','case when Marital_Status = \"Single\" then \"S\" when Marital_Status = \"Married\" then \"M\" else \"NA\" end')",

    // "('Gender','case when Gender = \"Male\" then \"M\" when Gender = \"Female\" then \"F\" else \"NA\" end')",

    // "(\"Total_Amount\",'Amount_Paid+Amount_of_Claim_Reserve')",

    // "('Date_of_Payment_of_Last_Premium','case when Date_of_Payment_of_Last_Premium = \"NULL\" then \"9999-12-31\" when Date_of_Payment_of_Last_Premium is not null then to_date(Date_of_Payment_of_Last_Premium,\"yyyyMMdd\") else \"NA\" end')",

    // "(\"current_date\",'current_date()')",

    // "(\"Date_Before_ten_day\",'date_sub(current_date(),10)')",

    // "(\"Date_After_ten_day\",'date_add(current_date(),10)')",

    // "(\"Date_after_two_month\",'add_months(current_date(),2)')",

    // "(\"Date_year\",'year(Date_of_Payment_of_Last_Premium)')",

    // "(\"Quarter\",'quarter(Date_of_Payment_of_Last_Premium)')",

    // "(\"Date_Month\",'month(Date_of_Payment_of_Last_Premium)')",

    // "(\"Week_day\",'dayofweek(Date_of_Payment_of_Last_Premium)')",

    // "(\"Month_day\",'dayofmonth(Date_of_Payment_of_Last_Premium)')",

    // "(\"Year_day\",'dayofyear(Date_of_Payment_of_Last_Premium)')",

    // "(\"Year_week\",'weekofyear(Date_of_Payment_of_Last_Premium)')",

    // "(\"Last_day_month\",'last_day(Date_of_Payment_of_Last_Premium)')",

    // "(\"No_of_days\",'datediff(current_date(),Date_of_Payment_of_Last_Premium)')",

    // "(\"No_of_months\",'months_between(current_date(),Date_of_Payment_of_Last_Premium,True)')",

    // "(\"Next_day\",'next_day(current_date(),\"Sunday\")')",

    // "(\"Tuncate_date_by_year\",'trunc(current_date(),\"yyyy\")')",

    // "(\"Tuncate_date_by_day\",'date_trunc(\"mm\",current_date())')",

    // "(\"current_datetime\",'date_sub(current_timestamp(),10)')",

    // "(\"Hour\",'hour(current_timestamp())')",

    // "(\"Minute\",'minute(current_timestamp())')",

    // "(\"Second\",'second(current_timestamp())')",

    // "(\"Timestamp\",'to_timestamp(current_timestamp())')",

    // "(\"Capitalize_First_Name\",'initcap(First_Name)')",

    // "(\"Upper_First_Name\",'upper(First_Name)')",

    // "(\"Lower_First_Name\",'lower(First_Name)')",

    // "(\"Trim_First_Name\",'trim(First_Name)')",

    // "(\"Lpad_First_Name\",'lpad(First_Name,20,\" \")')",

    // "(\"Replace_Nationality_NULL\",'regexp_replace(Nationality,\"NULL\",\"Indian\")')",

    // "(\"Column_Have_Indian\",'instr(Nationality,\"Indian\")')",

    // "(\"Translate_One_From_Column\",'translate(Nationality,\"a\",\"A\")')"
    `('Marital_Status','case when Marital_Status = "Single" then "S" when Marital_Status = "Married" then "M" else "NA" end')`,
    `('Gender','case when Gender = "Male" then "M" when Gender = "Female" then "F" else "NA" end')`,
    `("Total_Amount",'Amount_Paid+Amount_of_Claim_Reserve')`,
    `('Date_of_Payment_of_Last_Premium','case when Date_of_Payment_of_Last_Premium = "NULL" then "9999-12-31" when Date_of_Payment_of_Last_Premium is not null then to_date(Date_of_Payment_of_Last_Premium,"yyyyMMdd") else "NA" end')`,
    `("current_date",'current_date()')`,
    `("Date_Before_ten_day",'date_sub(current_date(),10)')`,
    `("Date_After_ten_day",'date_add(current_date(),10)')`,
    `("Date_after_two_month",'add_months(current_date(),2)')`,
    `("Date_year",'year(Date_of_Payment_of_Last_Premium)')`,
    `("Quarter",'quarter(Date_of_Payment_of_Last_Premium)')`,
    `("Date_Month",'month(Date_of_Payment_of_Last_Premium)')`,
    `("Week_day",'dayofweek(Date_of_Payment_of_Last_Premium)')`,
    `("Month_day",'dayofmonth(Date_of_Payment_of_Last_Premium)')`,
    `("Year_day",'dayofyear(Date_of_Payment_of_Last_Premium)')`,
    `("Year_week",'weekofyear(Date_of_Payment_of_Last_Premium)')`,
    `("Last_day_month",'last_day(Date_of_Payment_of_Last_Premium)')`,
    `("No_of_days",'datediff(current_date(),Date_of_Payment_of_Last_Premium)')`,
    `("No_of_months",'months_between(current_date(),Date_of_Payment_of_Last_Premium,True)')`,
    `("Next_day",'next_day(current_date(),"Sunday")')`,
    `("Tuncate_date_by_year",'trunc(current_date(),"yyyy")')`,
    `("Tuncate_date_by_day",'date_trunc("mm",current_date())')`,
    `("current_datetime",'date_sub(current_timestamp(),10)')`,
    `("Hour",'hour(current_timestamp())')`,
    `("Minute",'minute(current_timestamp())')`,
    `("Second",'second(current_timestamp())')`,
    `("Timestamp",'to_timestamp(current_timestamp())')`,
    `("Capitalize_First_Name",'initcap(First_Name)')`,
    `("Upper_First_Name",'upper(First_Name)')`,
    `("Lower_First_Name",'lower(First_Name)')`,
    `("Trim_First_Name",'trim(First_Name)')`,
    `("Lpad_First_Name",'lpad(First_Name,20," ")')`,
    `("Replace_Nationality_NULL",'regexp_replace(Nationality,"NULL","Indian")')`,
    `("Column_Have_Indian",'instr(Nationality,"Indian")')`,
    `("Translate_One_From_Column",'translate(Nationality,"a","A")')`

  ]

}




@Injectable()
export class FtpService {

  constructor(
    @InjectModel('Ftp') private readonly ftpModel: Model<Ftp>,
    @Inject(forwardRef(() => UploadtemplateService))
    private uploadtemplateService: UploadtemplateService) { }

  async create(ftp: FtpDto): Promise<Ftp> {
    try {
      return await this.ftpModel.create(ftp);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async update(id: string, Ftp: FtpDto): Promise<any> {
    try {
      return await this.ftpModel.update({ _id: id }, Ftp);
    } catch (e) {
      throw CustomException(e);
    }
  }

  async findById(id: string): Promise<Ftp> {
    try {
      const ftp = await this.ftpModel.findById(id);
      if (!ftp) {
        throw Exception();
      }
      return ftp;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async deleteById(id: string): Promise<Ftp> {
    try {
      const ftp = await this.ftpModel.findByIdAndDelete(id);
      if (!ftp) {
        throw Exception();
      }
      return ftp;
    } catch (e) {
      throw CustomException(e);
    }
  }

  async getAll(): Promise<Ftp[]> {
    try {
      return await this.ftpModel.find();
    } catch (e) {
      throw CustomException(e);
    }
  }

  async sftpFIleUplaod(file: any, dataset: any,updateTemplateData:any,timeStamp :any ) {
    try {
      await sftp.connect({
        host: '182.72.205.196',
        port: 22,
        username: 'httest',
        password: 'Ht@tst#200'
      });
      // await sftp.mkdir(`/opt/OpenSourceProjects`, true);
      console.log("huiii",`${updateTemplateData.source_path}${timeStamp}_${file[0].originalname}`)
      const tempCheck = await sftp.append(file[0]['buffer'], `${updateTemplateData.source_path}${timeStamp}_${file[0].originalname}`, { autoClose: true });
      // console.log('tempCheck tempCheck', tempCheck)
      // console.log('jhkjgkhkjhkh', await sftp.list(`/tmp/data/inbound`));
      // const checkExits = await sftp.exists(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/`);
      // // console.log('checkExits checkExits', checkExits)
      // if (!checkExits) {
      //   await sftp.mkdir(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/`, true);
      // }
      // // await sftp.mkdir('/opt/OpenSourceProjects/Betamartix/Landing_Dir/aerogen/', true);
      // await sftp.append(Buffer.from(JSON.stringify(resData)), `/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/${resData._id}.txt`);
      // // const sftpStore = await sftp.append(Buffer.from(JSON.stringify(resData)), `/opt/Aerospike_gen_data_file/${masterDetailsDto.name}_${resData._id}.txt`);
      // // console.log('sftpStore sftpStore', sftpStore)
      // // console.log('jhkjgkhkjhkh', await sftp.list(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/${code}/`));
      // // console.log('jhkjgkhkjhkh11111', await sftp.list(`/opt/OpenSourceProjects/Betamartix/Landing_Dir/`));

      await sftp.end();
    } catch (e) {
      console.log('e e e e e ', e)
      // throw CustomException(e);
    }
  }

  async ftpFileUpload(file: any, dataset: any) {
    console.log('file file file', file)
    // let buffer = Buffer.from(file[0]['buffer']);
    let timeStamp=Date.now()
    let updateTemplateData: any = await this.uploadtemplateService.findById(dataset);
    await this.sftpFIleUplaod(file, dataset,updateTemplateData,timeStamp);
    try {     
      
      if (updateTemplateData) {
        let pathsObje = {
        'source_path': `file:${updateTemplateData.source_path}${timeStamp}_${file[0].originalname}`,
        'target_path': `${updateTemplateData.target_path}`,
        "format" : updateTemplateData.format,
        "Filter": updateTemplateData.Filter,
        "DropUnusedFields":updateTemplateData.DropUnusedFields,
        "Rename":updateTemplateData.Rename,
        "delimiter":updateTemplateData.delimiter,
        "DefaultVaue":updateTemplateData.DefaultVaue,
        "Transform":updateTemplateData.Transform,
        "source_column":updateTemplateData.source_column
      }
        // delete updateTemplateData.fileName
        // updateTemplateData.source_path= `file:${updateTemplateData.source_path}${file[0].originalname}`,
        // updateTemplateData.target_path=`file:${updateTemplateData.target_path}`
        //let newObjWithData = { ...updateTemplateData._doc}
        console.log('newObjWithData newObjWithData', pathsObje);
        const res: any = await fetch('http://182.72.205.196:8000/sparkWorks', {
          method: 'POST', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pathsObje)
        });
        const data = await res.json()
        // console.log('data data', data);
        return data
      }
    } catch (e) {
      // console.log('ftpftpftp serive', e);
      // throw CustomException(e);
    }
  }

}
