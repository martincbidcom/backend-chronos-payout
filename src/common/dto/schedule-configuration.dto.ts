import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ScheduleConfigurationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameCron: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameFunction:string;

  @ApiProperty({default: true})
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
