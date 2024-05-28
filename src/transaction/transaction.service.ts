import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BindService } from 'src/bind/bind.service';
import { ProcessLog, StatusTransaction } from 'src/common/utils/enum';
import { Transacction } from 'src/entity/transsaction.entity';
import { TempLogService } from 'src/temp-log/temp-log.service';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transacction)
        private _transacctionRepository: Repository<Transacction>,
        private bindService: BindService,
        private tempLogService: TempLogService
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

    async sendTransaction(payload: any) {

        const transaction = await this.create({
            amountFiat: payload.amount,
            status: StatusTransaction.CREATED,
            referenceId: payload.reference,
            cvuDestination: payload.cvu
        });

        if (!transaction) throw new Error('Falla al registrar la transaccion')

        const sendTransaction = await this.bindService.doTransaction({
            destinationCbu: payload.cvu,
            amount: payload.amount,
            idTransaction: Number(transaction.id)
        })

        const updateTransaction = await this.update(transaction.id, {
            responseBind: JSON.stringify('sendTransaction'),
            status: StatusTransaction.SENT
        })

        if (updateTransaction.affected === 0) {
            await this.tempLogService.saveTempLog({
                process: ProcessLog.TRANSACTION,
                method: 'sendTransaction => no se pudo actualizar transaccion',
                description:
                    `idTransaction = ${transaction.id}, status = ${StatusTransaction.SENT}, response = ${'sendTransaction'}`,
            });

            throw new Error('Falla al guardar la respuesta de BIND')
        }

        return transaction
    }
}
