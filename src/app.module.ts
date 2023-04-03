import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeeModule } from './coffee/coffee.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './app.config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ApiKeyGuard } from './common/guard/api-key.guard';
import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';

// use Joi schema validation to ensure that certain env variables are passed in and in the correct format.

@Module({
  imports: [
    CoffeeModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/nest-course'), 
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      DATABASE_HOST: Joi.required(),
      DATABASE_PORT: Joi.number().default(5432),
    }),
    load: [appConfig]   
  }),
  CoffeeRatingModule,
  CommonModule
],
  controllers: [AppController],
  providers: [AppService,
    // { // This is still global
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe
    // }
    // { // This is still global
    //   provide: APP_GUARD,
    //   useClass: ApiKeyGuard
    // }
  ],
})
export class AppModule {}
