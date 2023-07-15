import {  Injectable, InternalServerErrorException,  NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {   Repository,     } from 'typeorm';


import { DataTable } from './entities/update-row.entity';
import { RowDto } from './dto/create-row.dto';
import { UpdateRawDto } from './dto/update-row.dto';


@Injectable()
export class RowService {

  
  constructor(
    @InjectRepository(DataTable)
    private readonly entityRepository: Repository<DataTable>,
   
    
  ) {}

  async insertRowIntoTable(data: any): Promise<any> {
    const { insertions, tableName } = data;
    await this.checkTableExists(tableName);
    const tableColumns = await this.getTableColumns(tableName);
  
    try {
      const sortedInsertions = insertions.map((insertion: any) => {
        const sortedInsertion: any = {};
        for (const columnName of tableColumns) {
          if (columnName in insertion) {
            sortedInsertion[columnName] = insertion[columnName];
          }
        }
        return sortedInsertion;
      });
  
      return await this.entityRepository.createQueryBuilder()
      .insert()
      .into(tableName)
      .values(sortedInsertions)
      .execute();

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al insertar los datos en la tabla.', error);
    }
  }

  async deleteRowByName(data:any): Promise<void> {
    const {tableName, id}= data
    await this.checkTableExists(tableName);
  
    try {
      await this.entityRepository.createQueryBuilder()
      .delete()
      .from(tableName)
      .where("id = :id", { id })
      .execute();

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al borrar la fila de la tabla.', error);
    }
  }

  async updateDataById(data: UpdateRawDto): Promise<void> {
    const {tableName, id, ...newData}= data
    await this.checkTableExists(tableName);
  
    try {
      await this.entityRepository.createQueryBuilder()
        .update(tableName)
        .set(newData)
        .where("id = :id", { id })
        .execute();

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar los datos en la tabla.', error);
    }
  }

  async findRowById(data:UpdateRawDto): Promise<any> {
    const {tableName, id} = data
    await this.checkTableExists(tableName);
  
    try {
      const query = `SELECT * FROM ${tableName} WHERE id = $1`;
      const data = await this.entityRepository.query(query, [id]);
  
      if (data.length === 0) {
        throw new NotFoundException(`No se encontró ningún dato con el ID ${id} en la tabla "${tableName}".`);
      }
  
      return data[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al obtener el dato de la tabla.', error);
    }
  }

  async findAllRows(tableName: string): Promise<any[]> {
    await this.checkTableExists(tableName);

    try {
    const query = `SELECT * FROM ${tableName}`;
    const data = await this.entityRepository.query(query);

    return data;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('Error al obtener los datos de la tabla.', error);
  }
  }

  private async getTableColumns(tableName: string): Promise<string[]> {
    const columnsQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`;
    const result = await this.entityRepository.query(columnsQuery);
    return result.map((row: any) => row.column_name);
  }

  private async checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
    const columnExistsQuery = `SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = '${tableName}' AND column_name = '${columnName}')`;
    const result = await this.entityRepository.query(columnExistsQuery);
    return result[0].exists;
  }
  
  private async checkTableExists(tableName: string): Promise<boolean> {
    const tableExistsQuery = `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${tableName}')`;
    const result = await this.entityRepository.query(tableExistsQuery);
      if (!result) {
        throw new NotFoundException(`La tabla "${tableName}" no existe.`);
      }
    return result[0].exists;
  }

}


/*
private async checkTableExist(tableName:string){
    const tableExists = await this.checkTableExists(tableName);
    if (!tableExists) {
      throw new NotFoundException(`La tabla "${tableName}" no existe.`);
    }
  }

**/


