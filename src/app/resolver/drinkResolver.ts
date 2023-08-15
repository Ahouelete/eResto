import { Injectable } from '@angular/core';
import { GlobalService } from '../providers/globalService';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { DrinkService } from '../providers/drinkServices';

@Injectable()
export class DrinkResolver implements Resolve<ApiResponse> {
  constructor(
    private drinkService: DrinkService,
    private globalService: GlobalService,
    private route: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.drinkService.all(0, 20).pipe(
      map((apiResponse) => apiResponse),
      catchError(() => of(null))
    );
  }
}
