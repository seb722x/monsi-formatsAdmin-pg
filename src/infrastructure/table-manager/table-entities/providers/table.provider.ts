import { Table, TableForeignKey } from "typeorm";
import { Template } from "../../table-templates/entities/templates.entity";



const tableColumns = (template:Template)=>{
   return template.columns.map((column) => ({
        name: column.name,
        type: column.type,
        isNullable: column.nullable,
        isUnique: column.unique
      }));    
}

const tableRelations = (template: Template): TableForeignKey[] =>  {
    if (!template.relations) {
        return []; // Devolver un array vacío si template.relations es null o undefined
      }

    return template.relations.map((relation) => {
      const foreignKey = new TableForeignKey({
        name: relation.name,
        columnNames: [relation.options.actualColumn],
        referencedColumnNames: [relation.options.referencedColumn],
        referencedTableName: relation.options.referencedTable,
        onDelete: 'CASCADE',
      });
  
      return foreignKey;
    });
  }


export const table = (tableName:string,template:Template) => {
    return new Table({
        name: tableName,
        columns: tableColumns(template),
        foreignKeys: tableRelations(template),
      });
} 

