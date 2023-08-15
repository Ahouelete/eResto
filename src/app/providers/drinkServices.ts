import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Drink } from '../models/drink';
import { ApiResponse } from '../models/apiResponse';

@Injectable()
export class DrinkService {
  url = environment.backend + '/drink';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(drink: Drink): Observable<Object> {
    return this.http.post(`${this.url}/create`, drink);
  }

  update(drink_id: number, drink: Drink): Observable<Object> {
    return this.http.put(`${this.url}/update/${drink_id}`, drink);
  }

  delete(drink_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${drink_id}`);
  }

  mocks(): Observable<ApiResponse> {
    const respones: Drink[] = [
      {
        id: 1,
        name: 'GUINESS',
        amount: 2500,
      },
      {
        id: 2,
        name: 'MOKA',
        amount: 2500,
      },
      {
        id: 3,
        name: 'YOUKI',
        amount: 2500,
      },
      {
        id: 4,
        name: 'BEAUFORT',
        amount: 2500,
      },
      {
        id: 5,
        name: 'BIERE',
        amount: 2500,
      },
    ];

    return of({
      success: true,
      object: respones,
      message: 'Liste des boisson',
    });
  }
}
