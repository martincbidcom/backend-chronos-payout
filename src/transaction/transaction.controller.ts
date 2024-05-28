import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BindService } from 'src/bind/bind.service';
import { DefaultResponsesDto, ErrorResponseDto } from 'src/common/dto/response.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    constructor(
        private bindService: BindService,
        private transactionService: TransactionService
    ){}

    @Get('token')
    async tokenBind(): Promise<DefaultResponsesDto | ErrorResponseDto> {
        try {
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: 'Token',
                data: await this.bindService.requestLogin()
            };
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('send')
    async sendTransaction( @Body() payload: any): Promise<DefaultResponsesDto | ErrorResponseDto> {
        try {
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: 'send Transaction',
                data: await this.transactionService.sendTransaction(payload)
            };
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
        }
    }
}
