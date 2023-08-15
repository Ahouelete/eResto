import { Customer } from './customer';
import { Drink } from './drink';
import { Food } from './food';
import { Payment } from './payment';

export interface Invoice {
  id: number | undefined | null;
  customer?: Customer | null | undefined;
  drinkList: Drink[];
  foodList: Food[];
  payment: Payment;
  status?: string;
  dateLiv?: Date;
  date?: Date;
}
