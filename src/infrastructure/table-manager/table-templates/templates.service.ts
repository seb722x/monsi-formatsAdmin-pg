import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {   FindOneOptions, Repository,  } from 'typeorm';


import { Template } from './entities/templates.entity';
import { TemplateDto } from './dto/create-temp.dto';
import { UpdateTemplateDto } from './dto/update-temp.dto';
import { ErrorService } from 'src/infrastructure/errors/erros.service';

@Injectable()
export class TemplateService {

  constructor(
    
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    private readonly errorhandle:ErrorService,

  ) {}

  async createTemplate(templateDto: TemplateDto): Promise<Template> {
    try{
      const template = this.templateRepository.create(templateDto);
      //template.uniques = templateDto.uniques;
      if (template.relations && template.relations.length > 0) {
        for (const relation of template.relations) {
          const tableName = relation.tableName;
          const columnName = relation.columnName;
          }
      }
      return await this.templateRepository.save(template);

    }catch(error){
      console.log(error.code)
      this.errorhandle.handleDBExceptions(error);
    }
  }

  async findTemplateByName(name: string): Promise<Template> {
    try {
      const options: FindOneOptions<Template> = {
        where: { name },
      };
      const template = await this.templateRepository.findOne(options);
      return template;
    }catch (error){
      this.errorhandle.notFoundError(error);
    }
  }

  async findAllTemplates( ) {
    const templates = await this.templateRepository.find()
    return  templates.map( ( template ) => ({
      ...template,
    }))
    
  }

  async updateTemplate( name: string, updateTemplateDto: UpdateTemplateDto ) {
    try{
      const template = await this.templateRepository.findOne({ where: { name } });
      Object.assign(template, updateTemplateDto);
      await this.templateRepository.save(template);
      
    }catch(error){
      return this.errorhandle.notFoundError(error);
    }
  }


  async removeTemplate(name: string):Promise<any> {
    try{
      const template = await this.findTemplateByName( name );
      await this.templateRepository.remove( template );
      return `Template "${template.name}" eliminada con exito `
    }catch(error){
      console.log(error.code)
      return this.errorhandle.notFoundError(error)
    }
  }
}

