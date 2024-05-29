import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { BindService } from 'src/bind/bind.service';
import {
  DefaultResponsesDto,
  ErrorResponseDto,
} from 'src/common/dto/response.dto';
import { TransactionService } from './transaction.service';
import { ApiTags } from '@nestjs/swagger';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleConfigurationService } from 'src/schedule-configuration/schedule-configuration.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private bindService: BindService,
    private transactionService: TransactionService,
    private scheduleConfigurationService: ScheduleConfigurationService,
  ) {}

  @Get('token')
  async tokenBind(): Promise<DefaultResponsesDto | ErrorResponseDto> {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Token',
        data: await this.bindService.requestLogin(),
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('send')
  async sendTransaction(
    @Body() payload: any,
  ): Promise<DefaultResponsesDto | ErrorResponseDto> {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'send Transaction',
        data: await this.transactionService.sendTransaction(payload),
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get-transaction')
  // @Cron(CronExpression.EVERY_MINUTE)
  async getPendingTransactions() {
    const cron =
      await this.scheduleConfigurationService.getScheduleConfiguration(
        'transacciones pendientes',
      );

    if (!cron.status) return true;

    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'get Transactions status',
        data: await this.transactionService.getPendingTransactions(),
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
