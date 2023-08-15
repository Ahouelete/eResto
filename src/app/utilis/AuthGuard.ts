import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenStorage } from './token.storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenStorage: TokenStorage) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenStorage.getToken() !== null) {
      const currentUser = JSON.parse(this.tokenStorage.getCurrentUser());

      if (currentUser) {
        const rolesName = currentUser.roles.map((r: any) => r.name);
        // if (rolesName.includes('ROLE_ADMIN')) {
        //   this.router.navigate(['/back-office']);
        // } else {
        //   this.router.navigate(['/home'], {
        //     queryParams: { returnUrl: state.url },
        //   });
        // }
        return true;
      } else {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
