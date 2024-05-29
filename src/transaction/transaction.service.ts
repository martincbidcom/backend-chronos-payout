import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BindService } from 'src/bind/bind.service';
import { ProcessLog, StatusTransaction } from 'src/common/utils/enum';
import { Transacctions } from 'src/entity/transsaction.entity';
import { TempLogService } from 'src/temp-log/temp-log.service';
import { In, Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class TransactionService {
  private URL = process.env.URL_BIND;
  private BANK_ID = process.env.BANK_ID_BIND;
  private ACCOUNT_ID = process.env.ACCOUNT_ID_BIND;
  private VIEW_ID = process.env.VIEW_ID_BIND;
  constructor(
    @InjectRepository(Transacctions)
    private _transacctionRepository: Repository<Transacctions>,
    private bindService: BindService,
    private tempLogService: TempLogService,
  ) {}

  async create(transacction: Transacctions) {
    const createTransacction =
      this._transacctionRepository.create(transacction);
    return await this._transacctionRepository.save(createTransacction);
  }

  async findOne(obj: any) {
    return await this._transacctionRepository.findOne(obj);
  }

  async update(id: string, obj: any) {
    return await this._transacctionRepository.update({ id }, obj);
  }

  /**
   * @method getPendingTransactions
   * Recupera todas las transacciones pendientes de la base de datos que tengan un estado 'IN_PROGRESS', 'IN_BIND_PROGRESS', o 'BIND_COMPLETED' y un tipo de transacción de cuenta 'cvu'
   * Obtener todas las transacciones no finalizadas de chronos y revisar si hubo cambios
   * @return {Promise<Array<any>>} An array of full transaction objects.
   */
  async getPendingTransactions() {
    const transactions = [];
    const dataTransactions = await this._transacctionRepository.find({
      where: {
        status: In(['IN_PROGRESS', 'IN_BIND_PROGRESS', 'BIND_COMPLETED']),
        account_transaction_type: 'cvu',
      },
    });
    const headers = {
      Authorization: `JWT ${await this.bindService.getToken()}`,
    };
    for (const transaction of dataTransactions) {
      const url: string = `${this.URL}/banks/${this.BANK_ID}/accounts/${this.ACCOUNT_ID}/${this.VIEW_ID}/transaction-request-types/TRANSFER/${transaction.transaction_id}`;
      const response = await axios
        .get(url, {
          headers,
        })
        .then((response) => response.data)
        .catch((error) => error.response.data);

      if (response.code) {
        transactions.push({
          idTransactiosn: transaction.id,
          status: transaction.status,
          message: response.message,
        });
      } else {
        //verificar si lo dejamos o lo quitamos
        //esto es para actualizar
        // if (transaction.status !== response.status) {
        //   await this._transacctionRepository.update(transaction.id, {
        //     status: response.status
        //   });
        // }
        transactions.push({
          idTransactiosn: transaction.transaction_id,
          status: transaction.status,
          message: '',
        });
      }
      return transactions;
    }
  }

  /**
   * @method sendTransaction
   * Crea una nueva transacción en el repositorio de transacciones.
   *
   * @param {any} payload - The payload containing the transaction details.
   * @return {Promise<any>} - The created transaction.
   */
  async sendTransaction(payload: any) {
    const transaction = await this.create({
      amountFiat: payload.amount,
      status: StatusTransaction.CREATED,
      referenceId: payload.reference,
      cvuDestination: payload.cvu,
    });

    if (!transaction) throw new Error('Falla al registrar la transaccion');

    const sendTransaction = await this.bindService.doTransaction({
      destinationCbu: payload.cvu,
      amount: payload.amount,
      idTransaction: Number(transaction.id),
    });

    const updateTransaction = await this.update(transaction.id, {
      responseBind: JSON.stringify('sendTransaction'),
      status: StatusTransaction.SENT,
    });

    if (updateTransaction.affected === 0) {
      await this.tempLogService.saveTempLog({
        process: ProcessLog.TRANSACTION,
        method: 'sendTransaction => no se pudo actualizar transaccion',
        description: `idTransaction = ${transaction.id}, status = ${StatusTransaction.SENT}, response = ${'sendTransaction'}`,
      });

      throw new Error('Falla al guardar la respuesta de BIND');
    }

    return transaction;
  }
}
