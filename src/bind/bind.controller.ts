import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { BindService } from './bind.service';
import { DoRequestDto } from 'src/common/dto/bind.dto';
import { ApiTags } from '@nestjs/swagger';
import { DefaultResponsesDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@ApiTags('BindController')
@Controller('transaction')
export class BindController {
  constructor(private readonly bindService: BindService) { }

  @Post('send-transaction')
  async sendTransaction(@Body() payload: DoRequestDto): Promise<DefaultResponsesDto | ErrorResponseDto> {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'send Transaction',
        data: await this.bindService.doTransaction(payload)
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get-transaction')
  async getTransaction(): Promise<DefaultResponsesDto | ErrorResponseDto> {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Get Transaction',
        data: await this.bindService.getTransaction()
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get-transaction/:id')
  async getTransactionById(@Param('id') id: string): Promise<DefaultResponsesDto | ErrorResponseDto> {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Get Transaction by Id',
        data: await this.bindService.getTransactionByID(id)
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get-account/:cvu')
  async getAccount(@Param('cvu') cvu: string): Promise<DefaultResponsesDto | ErrorResponseDto> {
    try {
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Get Account by cvu',
        data: await this.bindService.getAccount(cvu)
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
