import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../models/invoice';

@Injectable()
export class InvoiceService {
  url = environment.backend + '/invoice';

  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<Object> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(invoice: Invoice): Observable<Object> {
    return this.http.post(`${this.url}/create`, invoice);
  }

  update(invoice_id: number, invoice: Invoice): Observable<Object> {
    return this.http.put(`${this.url}/update/${invoice_id}`, invoice);
  }

  delete(invoice_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${invoice_id}`);
  }
}
