import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exception } from '../common/exceptions';
import { DbConfigDto, DbConfig } from './db-config.interface';
import { Stream } from 'form-data';
const { Pool, Client } = require("pg");
var mysql = require('mysql2/promise');
@Injectable()
export class DbConfigService {
  
  constructor(
    @InjectModel('DbConfig') private readonly appMasterModel: Model<DbConfig>,
  ) { }

  async find(screen: string): Promise<any> {
    return await this.appMasterModel.findOne({ screen: screen });

  }
  async create(appMaster: any): Promise<any> {
    try {
      
      if (appMaster.existingTable == false) {
        if (appMaster.db === 'postgres') {
          const client = new Client({
            host: appMaster.host,
            user: appMaster.user,
            database: appMaster.database,
            password: appMaster.password,
            port: appMaster.port
          });
          console.log('111111')
          await client.connect();
          var query = [`CREATE TABLE "${appMaster.tableName}" (exp_id VARCHAR(40)`];
          appMaster.config.map((item,i) => {
            console.log('itemyyy',item)
            if(item.type == 'select' || item.type == 'textfield' || item.type == 'datagrid' || item.type == 'textarea'){
              query.push(`, ${item.key} VARCHAR(255)`)
            }if(item.type == 'datetime'){
              query.push(`, ${item.key} TIMESTAMP NOT NULL`)
            }if(item.type == 'number'){
              query.push(`, ${item.key} NUMERIC`)
            }  
          })
          query.push(`)`)
          console.log('query', query.join(''))
          const now = await client.query(query.join(''));
          await client.end();
        }else if (appMaster.db === 'mySql') {
          var connection: any
          connection = await mysql.createConnection({
            host: appMaster.host,
            user: appMaster.user,
            password: appMaster.password,
            database: appMaster.database
          });
          await connection.connect();
          var query = [`CREATE TABLE ${appMaster.tableName} (exp_id VARCHAR(25)`];
          appMaster.config.map((item,i) => {
            console.log('itemyyy',item)
            if(item.type == 'select' || item.type == 'textfield' || item.type == 'datagrid' || item.type == 'textarea'){
              query.push(`, ${item.key} VARCHAR(255)`)
            }if(item.type == 'datetime'){
              query.push(`, ${item.key} DATETIME`)
            }if(item.type == 'number'){
              query.push(`, ${item.key} DECIMAL`)
            }  
          })
          query.push(`);`)
          var str:any
          str= query.join('').toString()
          console.log('query',str)
          const now = await connection.query(`${str}`)
          console.log('end', now)
          await connection.end();
        }
      } else {
        if (appMaster.db === 'postgres') {
          const credentials = {
            user: appMaster.user,
            host: appMaster.host,
            database: appMaster.database,
            password: appMaster.password,
            port: appMaster.port
          };
          console.log("yyeeeeeeeeeeeeee",credentials)
          const client = new Client(credentials);
          await client.connect();
          console.log("hiiiiiiiiiiiiiiiii") 
          const now = await client.query(`ALTER TABLE ${appMaster.tableName}
            ADD exp_id VARCHAR(40);`);
         console.log("byeeeeeeeeeeeee")
          await client.end();
        }
        if (appMaster.db === 'mySql') {
          var connection: any
          connection = await mysql.createConnection({
            host: appMaster.host,
            user: appMaster.user,
            password: appMaster.password,
            database: appMaster.database
          });
          await connection.connect();
          const now = await connection.query(`ALTER TABLE ${appMaster.tableName}
            ADD exp_id varchar(255);`)
          console.log('end', now)
          await connection.end();
        }
      }
      console.log('appmaster',appMaster)
      return await this.appMasterModel.create(appMaster);
    } catch {
      throw Exception();
    }
  }

  async update(id: string, DbConfig: DbConfigDto): Promise<any> {
    try {
      return await this.appMasterModel.updateOne({ _id: id }, DbConfig);
    } catch {
      throw Exception();
    }
  }

  async findById(id: string): Promise<DbConfig> {
    const appMaster = await this.appMasterModel.findById(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async deleteById(id: string): Promise<DbConfig> {
    const appMaster = await this.appMasterModel.findByIdAndDelete(id);
    if (!appMaster) {
      throw Exception();
    }
    return appMaster;
  }

  async getAll(): Promise<DbConfig[]> {
    try {
      return await this.appMasterModel.find();
    } catch {
      throw Exception();
    }
  }
  async getTables(user: string, host: string, port: string, password: string, database: string, dbtype: string): Promise<any> {
    console.log('dbtype', dbtype)
    if (dbtype == 'postgres') {
      const credentials = {
        user: user,
        host: host,
        database: database,
        password: password,
        port: port,
      };
      const client = new Client(credentials);
      await client.connect();
      const now = await client.query(`SELECT table_name as TablesName
      FROM information_schema.tables
     WHERE table_schema='public'
       AND table_type='BASE TABLE';`);
      await client.end();
      return now;
    }
    if (dbtype == 'mySql') {
      var connection: any
      connection = await mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
      });
      console.log("hiiiiiin", database)
      await connection.connect();
      //   const now = await connection.query(`SELECT table_name 
      //  FROM information_schema.tables WHERE table_schema=${database}`)
      const now = await connection.query(`SELECT table_name as tablesname from information_schema.tables where table_schema = '${database}';`)

      console.log('end', now)
      // await connection.execute(now);
      await connection.end();
      return now;
    }
  }

  async getExistingTables(user: string, host: string, port: string, password: string, database: string, dbtype: string, tableName: string): Promise<any> {
    console.log('dbtype', dbtype)
    if (dbtype == 'postgres') {
      const credentials = {
        user: user,
        host: host,
        database: database,
        password: password,
        port: port,
      };
      const client = new Client(credentials);
      await client.connect();
      const now = await client.query(`SELECT column_name  FROM information_schema.columns
      WHERE table_schema = 'public'
      AND TABLE_NAME = '${tableName}';`);
      await client.end();
      return now;
    }
    if (dbtype == 'mySql') {
      var connection: any
      connection = await mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
      });
      await connection.connect();
      const now = await connection.query(`SELECT column_name as column_name from information_schema.columns where TABLE_NAME = '${tableName}';`)
      console.log('end', now)
      await connection.end();
      return now;
    }
  }

}
