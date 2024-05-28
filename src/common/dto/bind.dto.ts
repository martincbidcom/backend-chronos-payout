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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  concept: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  origin_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  origin_debit_cvu?: string;
}
