import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BindService } from 'src/bind/bind.service';
import { ProcessLog, StatusTransaction } from 'src/common/utils/enum';
import { Transacctions } from 'src/entity/transsaction.entity';
import { TempLogService } from 'src/temp-log/temp-log.service';
import { In, Repository } from 'typeorm';
import axios from 'axios';
import { ScheduleConfigurationEntity } from 'src/entity/schedule-configuration.entity';

@Injectable()
export class ScheduleConfigurationService {
  constructor(
    @InjectRepository(ScheduleConfigurationEntity)
    private _scheduleConfigurationRepository: Repository<ScheduleConfigurationEntity>,
  ) {}

  async createScheduleConfiguration(transacction: ScheduleConfigurationEntity) {
    const createTransacction =
      this._scheduleConfigurationRepository.create(transacction);
    return await this._scheduleConfigurationRepository.save(createTransacction);
  }

  async getScheduleConfiguration(nameCron: string) {
    return await this._scheduleConfigurationRepository.findOne({
      where: { nameCron },
    });
  }
}
