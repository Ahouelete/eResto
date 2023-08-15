import { Customer } from './customer';
import { Food } from './food';
import { Payment } from './payment';

export interface Customer_payment {
  customer: Customer;
  payment: Payment;
  food: Food;
}
