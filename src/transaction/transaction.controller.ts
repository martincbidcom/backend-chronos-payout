import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BindService } from 'src/bind/bind.service';
import { DefaultResponsesDto, ErrorResponseDto } from 'src/common/dto/response.dto';

@Controller('transaction')
export class TransactionController {

    constructor(private bindService: BindService){}

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
                data: await this.bindService.doTransaction(payload)
            };
        } catch (error) {
            throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
        }
    }
}
