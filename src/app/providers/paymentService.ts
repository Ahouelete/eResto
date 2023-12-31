import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Food } from '../models/food';
import { ApiResponse } from '../models/apiResponse';
import { Menu } from '../models/menu';
import { Payment } from '../models/payment';

@Injectable()
export class PaymentService {
  url = environment.backend + '/payment';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  getPaymentById(menu_id: number): Observable<Object> {
    return this.http.get(`${this.url}/id/${menu_id}`);
  }

  create(payment: Payment): Observable<Object> {
    return this.http.post(`${this.url}/create`, payment);
  }

  update(payment_id: number, payment: Payment): Observable<Object> {
    return this.http.put(`${this.url}/update/${payment_id}`, payment);
  }

  delete(payment_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${payment_id}`);
  }

  mocks(): Observable<ApiResponse> {
    const respones: Food[] = [
      {
        id: 1,
        name: 'PATE BLANCHE',
        amount: 2500,
        ingredients: [
          {
            id: 1,
            name: 'SEL',
          },
          {
            id: 2,
            name: "UN LITRE D'EAU",
          },
          {
            id: 3,
            name: "DEMI LITRE D'HUILE OLIVE",
          },
        ],
      },
      {
        id: 2,
        name: 'AMIWO',
        amount: 2500,
        ingredients: [
          {
            id: 1,
            name: 'SEL',
          },
          {
            id: 2,
            name: "UN LITRE D'EAU",
          },
          {
            id: 3,
            name: "DEMI LITRE D'HUILE OLIVE",
          },
        ],
      },
      {
        id: 3,
        name: 'ATAXI',
        amount: 2500,
        ingredients: [
          {
            id: 1,
            name: 'SEL',
          },
          {
            id: 2,
            name: "UN LITRE D'EAU",
          },
          {
            id: 3,
            name: "DEMI LITRE D'HUILE OLIVE",
          },
        ],
      },
      {
        id: 4,
        name: 'RIZ AU GRAS',
        amount: 2500,
        ingredients: [
          {
            id: 1,
            name: 'SEL',
          },
          {
            id: 2,
            name: "UN LITRE D'EAU",
          },
          {
            id: 3,
            name: "DEMI LITRE D'HUILE OLIVE",
          },
        ],
      },
      {
        id: 5,
        name: 'RIZ BLANC',
        amount: 2500,
        ingredients: [
          {
            id: 1,
            name: 'SEL',
          },
          {
            id: 2,
            name: "UN LITRE D'EAU",
          },
          {
            id: 3,
            name: "DEMI LITRE D'HUILE OLIVE",
          },
        ],
      },
    ];

    return of({
      success: true,
      object: respones,
      message: 'Liste des boisson',
    });
  }
}
