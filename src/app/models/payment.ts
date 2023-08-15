import { Transaction } from './transaction';

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  REFUNDED = 'REFUNDED',
}

export interface Payment {
  id?: number | undefined | null;
  paymentStatus?: PAYMENT_STATUS;
  realAmountPaid?: number;
  transaction: Transaction;
}
