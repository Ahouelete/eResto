import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Drink } from '../models/drink';
import { Food } from '../models/food';
import { Ingredient } from '../models/ingredient';

@Injectable()
export class IngredientService {
  url = environment.backend + '/ingredient';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<Object> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(ingredient: Ingredient): Observable<Object> {
    return this.http.post(`${this.url}/create`, ingredient);
  }

  update(ingredient_id: number, ingredient: Ingredient): Observable<Object> {
    return this.http.put(`${this.url}/update/${ingredient_id}`, ingredient);
  }

  delete(ingredient_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${ingredient_id}`);
  }
}
