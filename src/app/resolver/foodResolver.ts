import { Injectable } from '@angular/core';
import { FoodService } from '../providers/foodServices';
import { GlobalService } from '../providers/globalService';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { SwalService, TYPE_ERROR } from '../providers/swalService';
import { Food } from '../models/food';

@Injectable()
export class FoodResolver implements Resolve<Food> {
  constructor(
    private foodService: FoodService,
    private globalService: GlobalService,
    private swalService: SwalService,
    private route: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.globalService.toogleLoading();

    return this.foodService.getFoodById(+route.params['food_id']).pipe(
      map((apiResponse) => apiResponse),
      catchError(() => {
        this.globalService.toogleLoading();
        this.route.navigateByUrl('/home');
        return of(null);
      })
    );
  }
}
