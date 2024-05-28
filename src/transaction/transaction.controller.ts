import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
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

    @Get('send')
    async sendTransaction(): Promise<DefaultResponsesDto | ErrorResponseDto> {
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
}
