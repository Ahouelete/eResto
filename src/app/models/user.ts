import { Person } from './person';
import { Role } from './roles';

export interface User {
  id: number | null | undefined;
  username: string;
  password?: string;
  person: Person;
  roles: Role[];
  active: boolean;
}
