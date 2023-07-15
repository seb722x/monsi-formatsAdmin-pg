import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export function createCustomTableEntity(config: any): any {
  @Entity({ name: config.name })
  class CustomTableEntity {
   

    constructor() {
      // Agregar columnas dinámicamente
      for (let i = 1; i < config.columns.length; i++) {
        const column = config.columns[i];
        Object.defineProperty(this, column.name, {
          writable: true,
          enumerable: true,
        });
        Column(column.type, getColumnOptions(column))(this, column.name);
      }
      
    }
  }

  return CustomTableEntity;
}

// Obtener opciones de columna
function getColumnOptions(column: any): any {
  const options = {};
  if (column.options) {
    for (const option of column.options) {
      Object.assign(options, option);
    }
  }
  return options;
}