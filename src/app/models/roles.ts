export enum ROLES_NAME {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_CUSTOMER = 'ROLE_CUSTOMER',
}

export interface Role {
  id: number;
  description: string;
  name: ROLES_NAME;
}
