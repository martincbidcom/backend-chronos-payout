import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BindModule } from './bind/bind.module';
import { TransactionModule } from './transaction/transaction.module';
import { TempLogModule } from './temp-log/temp-log.module';
import { ScheduleConfigurationModule } from './schedule-configuration/schedule-configuration.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BindModule,
    TransactionModule,
    TempLogModule,
    BindModule,
    ScheduleConfigurationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
