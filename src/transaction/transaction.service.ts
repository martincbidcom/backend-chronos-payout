import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transacction } from 'src/entity/transsaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transacction)
        private _transacctionRepository: Repository<Transacction>,
    ) { }

    async create(transacction: Transacction) {
        const createTransacction = this._transacctionRepository.create(transacction);
        return await this._transacctionRepository.save(createTransacction);
    }

    async findOne(obj: any) {
        return await this._transacctionRepository.findOne(obj);
    }

    async update(id: string, obj: any) {
        return await this._transacctionRepository.update({ id }, obj);
    }
}
