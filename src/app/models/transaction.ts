export enum PAYMENT_METHOD {
  CREDIT_CARD = 'CREDIT_CARD',
  DIRECT_CASH = 'DIRECT_CASH',
  DEBIT_CARD = 'DEBIT_CARD',
  E_WALLET = 'E_WALLET',
  MOBILE_MONEY = 'MOBILE_MONEY',
}

export enum CURRENCY {
  EURO = 'EURO',
  XOF = 'XOF',
  USD = 'USD',
}

export interface Transaction {
  id?: number | undefined | null;
  amount: number;
  paymentMethod: PAYMENT_METHOD;
  transactionFee?: number | undefined | null;
  currency: CURRENCY;
}
