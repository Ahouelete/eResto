import { User } from './user';

export interface Customer {
  id: number | undefined | null;
  adress: string;
  user: User;
}
