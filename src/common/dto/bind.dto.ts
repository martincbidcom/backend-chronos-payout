import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DoRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationCbu: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
