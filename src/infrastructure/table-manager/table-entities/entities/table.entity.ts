import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('jsonb')
  fields: any[];

  constructor() {
    this.fields = [];
  }

  setFieldsFromObject(obj: Record<string, any>) {
    this.fields = Object.values(obj) as any[]; // Realiza la conversión a arreglo con 'as any[]'
  }
}