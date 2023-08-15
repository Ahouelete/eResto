import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Customer } from '../models/customer';
import { ROLES_NAME } from '../models/roles';
import { ApiResponse } from '../models/apiResponse';

@Injectable()
export class CustomerService {
  url = environment.backend + '/customer';
  roles = [
    {
      id: 1,
      name: ROLES_NAME.ROLE_ADMIN,
      description: 'Administrateur',
    },
    {
      id: 2,
      name: ROLES_NAME.ROLE_CUSTOMER,
      description: 'Customer',
    },
  ];

  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(customer: Customer): Observable<Object> {
    return this.http.post(`${this.url}/create`, customer);
  }

  update(customer_id: number, customer: Customer): Observable<Object> {
    return this.http.put(`${this.url}/update/${customer_id}`, customer);
  }

  delete(customer_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${customer_id}`);
  }

  getCustomerByName(username: string): Observable<any> {
    return this.http.get(`${this.url}/username/${username}`);
  }

  mocks(): Observable<ApiResponse> {
    const responses: Customer[] = [
      {
        id: 1,
        adress: 'ABOMEY CALAVI',
        user: {
          active: true,
          id: 1,
          password: '',
          username: 'marcahouete@gmail.com',
          roles: this.roles,
          person: {
            id: 1,
            firstName: 'MARCEL AHOUELETE',
            lastName: 'ZONDOGA',
            email: 'marcahouete@gmail.com',
          },
        },
      },
      {
        id: 2,
        adress: 'COTONOU',
        user: {
          active: true,
          id: 1,
          password: '',
          username: 'christian@gmail.com',
          roles: this.roles,
          person: {
            id: 1,
            firstName: 'CHRISTIAN',
            lastName: 'AKPONA',
            email: 'christian@gmail.com',
          },
        },
      },
    ];

    return of({
      success: true,
      object: responses,
      message: 'Liste des boisson',
    });
  }

  mockRoles(): Observable<ApiResponse> {
    const roles = [
      {
        id: 1,
        name: ROLES_NAME.ROLE_ADMIN,
        description: 'Administrateur',
      },
      {
        id: 2,
        name: ROLES_NAME.ROLE_CUSTOMER,
        description: 'Customer',
      },
    ];

    return of({
      success: true,
      object: roles,
      message: 'Liste des roles',
    });
  }
}
