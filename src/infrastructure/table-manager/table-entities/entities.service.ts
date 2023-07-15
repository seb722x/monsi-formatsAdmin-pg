import {  Injectable,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Connection, Repository,  } from 'typeorm';


import { CustomTable } from './entities/custom-table.entity';
import { TemplateService } from '../table-templates/templates.service';
import { table } from './providers/table.provider';
import { tableDto } from './dtos/create-table.dto';


@Injectable()
export class TableService {

  private CustomTableEntity: any;
  constructor(
    private readonly templateService:TemplateService,
    @InjectRepository(CustomTable)
    private readonly entityRepository: Repository<CustomTable>,
    private readonly connection: Connection,
    
  ) {}

  
  
  async createTableFromTemplate(data: tableDto): Promise<void> {
    const template = await this.templateService.findTemplateByName(data.templateName);
    const tableName = data.tableName;
    const queryRunner = this.entityRepository.manager.connection.createQueryRunner();

    const table1 = table(tableName,template)
    return await queryRunner.createTable(table1);
  
  }

  async findTableByName(tableName: string): Promise<any | undefined> {
    const tableData = await this.entityRepository.query(`SELECT * FROM "${tableName}"`);
    console.log(tableData);
    return tableData;
  }

  async deleteTable(tableName: string): Promise<void> {
    await this.entityRepository.query(`DROP TABLE IF EXISTS "${tableName}"`);
  }

  async modifyColumn(tableName: string, column: string, newName: string, newType: string): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const tableExists = await queryRunner.hasTable(tableName);
      if (!tableExists) {
        throw new Error(`Table '${tableName}' does not exist.`);
      }

      const columnExists = await queryRunner.hasColumn(tableName, column);
      if (!columnExists) {
        throw new Error(`Column '${column}' does not exist in table '${tableName}'.`);
      }

      const query = `ALTER TABLE ${tableName} ALTER COLUMN ${column} RENAME TO ${newName};`;
      await queryRunner.query(query);

      const alterTypeQuery = `ALTER TABLE ${tableName} ALTER COLUMN ${newName} TYPE ${newType};`;
      await queryRunner.query(alterTypeQuery);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  private async processRelation(relation: any): Promise<void> {
    const { type, options } = relation;

    switch (type) {
      
      case 'OneToMany':
        await this.establishOneToManyRelation(
          options.referencedTable,
          options.referencedColumn,
          options.actualTable,
          options.actualColumn,
        );
        break;
      // Agrega casos adicionales para otros tipos de relaciones según sea necesario
      default:
        throw new Error(`Invalid relationship type: ${type}`);
    }
  }
  async establishRelationship(relations: any): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      await this.processRelations(relations);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  private async processRelations(relations: any): Promise<void> {
    if (!Array.isArray(relations)) {
      throw new Error('Relations must be an array.');
    }

    for (const relation of relations) {
      await this.processRelation(relation);
    }
  }

   private async establishOneToManyRelation(
    referencedTable: string,
    referencedColumn: string,
    actualTable: string,
    actualColumn: string,
  ): Promise<void> {
    // Implementa la lógica para establecer una relación One-to-Many
    const sql = `
      ALTER TABLE ${actualTable}
      ADD CONSTRAINT fk_${actualTable}_${referencedTable}
      FOREIGN KEY (${actualColumn})
      REFERENCES ${referencedTable} (${referencedColumn})
      ON DELETE CASCADE;
    `;
    await this.connection.query(sql);
  }
















  

}

/* 

//async createEntityORM(name:string){
  //  const template = this.templateService.findTemplateByName(name);
  //  this.CustomTableEntity = createCustomTableEntity(template);
  //  //const entityMetadata = this.connection.getMetadata(this.CustomTableEntity);
  //  const entityRepository = this.connection.getRepository(this.CustomTableEntity);
  //  //console.log(entityMetadata);
  //  console.log(entityRepository);
  //}

private async  createTable(data: Record<string, any>, tableRelations?){

    const template = await this.templateService.findTemplateByName(data.templateName);
    const tableName = data.tableName;
    const queryRunner = this.entityRepository.manager.connection.createQueryRunner();

    const tableColumns = template.columns.map((column) => ({
      name: column.name,
      type: column.type,
      isNullable: column.nullable,
      isUnique: column.unique
    }));

    const table = new Table({
      name: tableName,
      columns: tableColumns,
      foreignKeys: tableRelations ? tableRelations : null,
    });
  
    await queryRunner.createTable(table);
  }



async createTableWithRelations(data: Record<string, any>): Promise<void> {
  const template = await this.templateService.findTemplateByName(data.templateName);
  const tableName = data.tableName;
  const queryRunner = this.entityRepository.manager.connection.createQueryRunner();

  const tableColumns = template.columns.map((column) => ({
    name: column.name,
    type: column.type,
    isNullable: column.nullable,
    isUnique: column.unique
  }));

  const tableRelations = template.relations.map((relation) => {
    const foreignKey = new TableForeignKey({
      name: relation.name,
      columnNames: [relation.options.actualColumn],
      referencedColumnNames: [relation.options.referencedColumn],
      referencedTableName: relation.options.referencedTable,
      onDelete: 'CASCADE',
    });

    return foreignKey;
  });

  const table = new Table({
    name: tableName,
    columns: tableColumns,
    foreignKeys: tableRelations,
  });

  await queryRunner.createTable(table);
}


//async createEntityTableWithRelations(data: Record<string, any>): Promise<void> {
//  const template = await this.templateService.findTemplateByName(data.templateName);
//  const tableName = data.tableName;
//
//  const queryRunner = this.entityRepository.manager.connection.createQueryRunner();
//  const table = new Table({
//    name: tableName,
//    columns: template.columns.map((column) => ({
//      name: column.name,
//      type: column.type,
//      isUnique: true,
//    })),
//    foreignKeys: template.relations.map((relation) => {
//      return new TableForeignKey({
//        name: `fk_${tableName}_${relation.actualColumn}`,
//        columnNames: [relation.actualColumn],
//        referencedColumnNames: [relation.referencedColumn],
//        referencedTableName: relation.referencedTable,
//      });
//    }),
//  });
//
//  await queryRunner.createTable(table);
//
//  await queryRunner.release();
//}










//async createTableFromTemplate(templateName: string, data: Record<string, any>): Promise<void> {
//  const template = await this.templatesServices.findTemplateByName(templateName);
//  const tableName = data.tableName;
//
//  const queryRunner = this.customRepository.manager.connection.createQueryRunner();
//
//  // Crear la tabla principal
//  const mainTable = new Table({
//    name: tableName,
//    columns: template.fields.map((field: any) => ({
//      name: field.name,
//      type: field.type,
//    })),
//  });
//
//  // Verificar si hay relaciones definidas en el template
//  if (template.relations && template.relations.length > 0) {
//    // Iterar sobre cada relación y crear las columnas de relación en la tabla principal
//    for (const relation of template.relations) {
//      const referencedTable = relation.options.referencedTable;
//      const referencedColumn = relation.options.referencedColumn;
//      const actualColumn = relation.options.actualColumn;
//
//      // Crear columna de relación
//      const relationColumn = new TableColumn({
//        name: actualColumn,
//        type: 'integer', // Ajusta el tipo de dato según corresponda
//      });
//
//      // Agregar la columna de relación a la tabla principal
//      mainTable.addColumn(relationColumn);
//
//      // Establecer la relación con la tabla referenciada
//      const foreignKey = new TableForeignKey({
//        columnNames: [actualColumn],
//        referencedTableName: referencedTable,
//        referencedColumnNames: [referencedColumn],
//      });
//
//      // Agregar la clave foránea a la tabla principal
//      mainTable.addForeignKey(foreignKey);
//    }
//  }
//
//  // Crear la tabla principal en la base de datos
//  await queryRunner.createTable(mainTable);
//
//  // Agregar restricciones únicas a las columnas de relación
//  if (template.relations && template.relations.length > 0) {
//    for (const relation of template.relations) {
//      const actualColumn = relation.options.actualColumn;
//
//      // Agregar restricción única a la columna de relación
//      const uniqueConstraint = new TableUnique({
//        columnNames: [actualColumn],
//      });
//
//      // Agregar la restricción única a la tabla principal
//      await queryRunner.createUniqueConstraint(tableName, uniqueConstraint);
//    }
//  }
//
//  // Finalizar la transacción y liberar los recursos
//  await queryRunner.release();
//}

  // ...










//  async createEntityFromTemplate(templateName: string, data: Record<string, any>): Promise<void> {
//    const template = await this.templateService.findTemplateByName(templateName);
//    const tableName = data.tableName;
//    console.log(tableName)
//    const queryRunner = this.customRepository.manager.connection.createQueryRunner();
//    const table = new Table({
//      name: tableName,
//      columns: template.fields.map((field) => ({
//        name: field.name,
//        type: field.type,
//      })),
//      
//    })
//    console.log(table)
//    await queryRunner.createTable(table);
//    console.log(table);
//  }

//async createEntityWithRelations(templateName: string, data: Record<string, any>): Promise<void> {
//  const template = await this.getTemplateByName(templateName);
//  const tableName = data.tableName;
//  const queryRunner = this.customRepository.manager.connection.createQueryRunner();
//  const table = new Table({
//    name: tableName,
//    columns: template.fields.map((field) => ({
//      name: field.name,
//      type: field.type,
//    })),
//  });
//  if (template.relations && template.relations.length > 0) {
//    for (const relation of template.relations) {
//      const columnName = relation.columnName;
//      const columnType = relation.columnType;
//
//      table.columns.push({
//        name: columnName,
//        type: columnType,
//        isNullable: false,
//        '@instanceof': undefined,
//        isGenerated: false,
//        isPrimary: false,
//        isUnique: false,
//        isArray: false,
//        length: '',
//        zerofill: false,
//        unsigned: false,
//        clone: function (): TableColumn {
//          throw new Error('Function not implemented.');
//        }
//      });
//    }
//  }
//
//  // Crear la tabla en la base de datos
//  await queryRunner.createTable(table);
//  // Crear las relaciones dinámicamente
//  if (template.relations && template.relations.length > 0) {
//    for (const relation of template.relations) {
//      const relationType = relation.relationType;
//      const relationName = relation.relationName;
//      const referencedTableName = relation.referencedTableName;
//      const referencedColumnName = relation.referencedColumnName;
//
//      if (relationType === 'ManyToOne' || relationType === 'ManyToMany') {
//        const foreignKey = new TableForeignKey({
//          columnNames: [relationName],
//          referencedColumnNames: [referencedColumnName],
//          referencedTableName: referencedTableName,
//        });
//
//        table.foreignKeys.push(foreignKey);
//      }
//    }
//  }
//  // Confirmar los cambios y cerrar el QueryRunner
//  await queryRunner.commitTransaction();
//  await queryRunner.release();
//
//
**/
