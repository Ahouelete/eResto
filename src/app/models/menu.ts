import { Food } from './food';

export interface Menu {
  id: number | undefined | null;
  localDate: Date;
  foods: Food[];
}
