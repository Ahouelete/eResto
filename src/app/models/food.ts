import { Ingredient } from './ingredient';

export interface Food {
  id: number;
  name: string;
  amount: number;
  ingredients?: Ingredient[];
}
