import { Injectable } from '@angular/core';
import { GlobalService } from '../providers/globalService';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { MenuService } from '../providers/menuService';
import { ApiResponse } from '../models/apiResponse';

@Injectable()
export class MenuResolver implements Resolve<ApiResponse> {
  constructor(
    private menuService: MenuService,
    private globalService: GlobalService,
    private route: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.globalService.toogleLoading();

    return this.menuService.all(0, 10).pipe(
      map((apiResponse) => apiResponse),
      catchError(() => {
        // this.globalService.toogleLoading();
        return of(null);
      })
    );
  }
}
