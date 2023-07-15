
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './infrastructure/auth/auth.module';
import { FormEntitiesModule } from './infrastructure/table-manager/table-manager.module';



                    


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      autoLoadEntities: true,
      synchronize: true,
    }),

    
    
    //ConfigModule.forRoot({
    //  envFilePath: '.env',
    //  isGlobal: true,
    //  expandVariables: true,
    //  
    //}),
     
      
    AuthModule,
    FormEntitiesModule
    
    
    

  ],
})
export class AppModule {}
