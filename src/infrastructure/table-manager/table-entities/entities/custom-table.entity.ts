import {   Entity,    } from 'typeorm';
import { BaseTemplate } from './create-table.entity';

@Entity()
export class CustomTable extends BaseTemplate {
// constructor(data?: { [key: string]: any }) {
//   super(); // Llamar al constructor de la clase base
//
//   if (data) {
//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         this[key] = data[key];
//         this.addColumn(key, data[key]);
//       }
//     }
//   }
// }
//
// //  agregar columnas dinámicamente
// addColumn(name: string, value: any): void {
//   if (!this.hasOwnProperty(name)) {
//     Object.defineProperty(this, name, {
//       value,
//       writable: true,
//       configurable: true,
//       enumerable: true,
//     });
//
//     
//   }
// }
}