import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CvuAccountTransactionsEntity } from 'src/entity/cvu-account-transactions.entity';
import { StellarAccountTransactionsEntity } from 'src/entity/stellar-account-transactions.entity';
import { StellarAccountEntity } from 'src/entity/stellar-account.entity';
import { BindService } from 'src/bind/bind.service';
import { ProcessLog, StatusTransaction } from 'src/common/utils/enum';
import { Transacction } from 'src/entity/transsaction.entity';
import { TempLogService } from 'src/temp-log/temp-log.service';
import { Repository } from 'typeorm';
import { BindCvuAccountsTransactionsEntity } from 'src/entity/bind-cvu-accounts-transactions.entity';
import { UserRolesEntity } from 'src/entity/user-roles.entity';
import { CvuAccountsEntity } from 'src/entity/cvu-accounts.entity';
import { CounterpartyLocalTransactionsEntity } from 'src/entity/counterparty-local-transactions.entity';
import { CounterpartyStellarTransactionsEntity } from 'src/entity/counterparty-stellar-transactions.entity';
import { CounterpartyCbuTransactionsEntity } from 'src/entity/counterparty_cbu_transactions.entity';
import axios from 'axios';

@Injectable()
export class TransactionService {
  private URL = process.env.URL_BIND;
  private BANK_ID = process.env.BANK_ID_BIND;
  private ACCOUNT_ID = process.env.ACCOUNT_ID_BIND;
  private VIEW_ID = process.env.VIEW_ID_BIND;
  constructor(
    @InjectRepository(Transacction)
    private _transacctionRepository: Repository<Transacction>,
    private bindService: BindService,
    private tempLogService: TempLogService,
  ) {}

  async create(transacction: Transacction) {
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
    let data = await this._transacctionRepository
      .createQueryBuilder('transaction')
      .where('transaction.status IN (:...statuses)', {
        statuses: ['IN_PROGRESS', 'IN_BIND_PROGRESS', 'BIND_COMPLETED'],
      })
      .andWhere('transaction.account_transaction_type = :type', {
        type: 'cvu',
      })
      .getRawMany();
    data = [
      {
        transaction_id: '66479',
        account_transaction_id: '63976',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36502',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:42',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_PROGRESS',
        uitoken: 'd3b74c8d-4100-4cb1-b701-fb45c4aec2f2',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66478',
        account_transaction_id: '63975',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36501',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:36',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: 'd464bc98-20aa-48d0-8b95-4ef824c9680b',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66477',
        account_transaction_id: '63974',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36500',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:29',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: 'ff277d0a-f616-4e18-837a-ce79be7f5c20',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66476',
        account_transaction_id: '63973',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36499',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:21',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '7ef810db-6099-4c6f-819e-d14dbdd62f5f',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66475',
        account_transaction_id: '63972',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36498',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:13',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '1003e995-0d40-446e-b6d7-82c1070f91bd',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66474',
        account_transaction_id: '63971',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36497',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:07',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '26eee08b-5482-48d4-b971-3ac7a4b2280f',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66473',
        account_transaction_id: '63970',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36496',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:03',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '72378539-6241-4483-a238-5bb1ae1cdfc1',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66472',
        account_transaction_id: '63969',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36495',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:21:51',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: 'd90a5a1e-21a1-46a4-a51b-b8801030d85d',
        related_payment_request_payment_id: null,
      },
    ];
    const url: string = `${this.URL}/banks/${this.BANK_ID}/accounts/${this.ACCOUNT_ID}/${this.VIEW_ID}/transaction-request-types/TRANSFER-CVU`;
    try {
      const headers = {
        Authorization: `JWT ${await this.bindService.getToken()}`,
      };
      const response = await axios.get(
        url,
        {
          headers,
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
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
