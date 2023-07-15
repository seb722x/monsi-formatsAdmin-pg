import {   Entity,    } from 'typeorm';
import { GenericTable } from './generic-row.entity';


@Entity()
export class DataTable extends GenericTable {}