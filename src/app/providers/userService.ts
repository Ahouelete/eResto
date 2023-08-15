import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { ApiResponse } from '../models/apiResponse';
import { ROLES_NAME } from '../models/roles';

@Injectable()
export class UserService {
  url = environment.backend + '/user';
  urlRole = environment.backend + '/role';
  constructor(private http: HttpClient) {}
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

  all(pageNo: number, pageSize: number): Observable<Object> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(user: User): Observable<Object> {
    return this.http.post(`${this.url}/create`, user);
  }

  update(user_id: number, user: User): Observable<Object> {
    return this.http.put(`${this.url}/update/${user_id}`, user);
  }

  delete(user_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${user_id}`);
  }

  getRoles(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.urlRole}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.url}/username/${username}`);
  }

  mocks(): Observable<ApiResponse> {
    const responses: User[] = [
      {
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
      {
        active: true,
        id: 2,
        password: '',
        username: 'christiann@gmail.com',
        roles: this.roles,
        person: {
          id: 1,
          firstName: 'CHRISTIAN',
          lastName: 'AKPONA',
          email: 'christiann@gmail.com',
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
