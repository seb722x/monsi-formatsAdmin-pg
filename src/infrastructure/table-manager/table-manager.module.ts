import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorService } from '../errors/erros.service';
import { TableService } from './table-entities/entities.service';
import { EntitiesController } from './table-entities/entities.controller';
import { TemplatesController } from './table-templates/templates.controller';
import { Template } from './table-templates/entities/templates.entity';
import { CustomTable } from './table-entities/entities/custom-table.entity';
import { TemplateService } from './table-templates/templates.service';
import { RowService } from './table-row/row.service';
import { RowController } from './table-row/row.controller';
import { DataTable } from './table-row/entities/update-row.entity';
import { GenericTable } from './table-row/entities/generic-row.entity';



@Module({
  imports: [TypeOrmModule.forFeature([CustomTable,Template, DataTable,GenericTable])],
  providers: [TemplateService,TableService, RowService, ErrorService],
  controllers: [TemplatesController,EntitiesController, RowController],
})
export class FormEntitiesModule {}


//