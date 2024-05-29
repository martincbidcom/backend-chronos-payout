import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScheduleConfigurationService } from './schedule-configuration.service';
import { ScheduleConfigurationDto } from 'src/common/dto/schedule-configuration.dto';

@ApiTags('Schedule Configuration')
@Controller('schedule-configuration')
export class ScheduleConfigurationController {
  constructor(
    private scheduleConfigurationService: ScheduleConfigurationService,
  ) {}

  @Post('create-schedule-configuration')
  async createScheduleConfiguration(@Body() body: ScheduleConfigurationDto) {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'create schedule configuration',
        data: await this.scheduleConfigurationService.createScheduleConfiguration(
          body,
        ),
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
