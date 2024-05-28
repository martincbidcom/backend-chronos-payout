import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TempLogITF } from 'src/common/interfaces/tempLog.interface';
import { TempLog } from 'src/entity/temp-log.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TempLogService {
    constructor(
        @InjectRepository(TempLog)
        private tempLogRepository: Repository<TempLog>,
    ) { }

    async saveTempLog(data: TempLogITF) {
        const templogdata = await this.tempLogRepository.create(data)
        const responseInsert = await this.tempLogRepository.save(templogdata);
        return responseInsert;
    }

    async deleteTemp(days: number) {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - days);

        try {
            const responseInsert = await this.tempLogRepository.delete({
                createdAt: LessThanOrEqual(twoDaysAgo),
            });

            return responseInsert;
        } catch (error) {
            console.error('Error al eliminar registros:', error);
            throw error;
        }
    }

    async deleteTempAll() {
        try {
            const responseInsert = await this.tempLogRepository.clear();
            return responseInsert;
        } catch (error) {
            console.error('Error al eliminar todos registros:', error);
            throw error;
        }
    }
}
