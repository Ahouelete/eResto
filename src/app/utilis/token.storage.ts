import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'AuthToken';
const PANIER_KEY = 'panier';
const CURRENT_USER = 'CURRENT_USER';

@Injectable()
export class TokenStorage {
  expirationsession: number;
  constructor() {
    this.expirationsession = new Date().getTime() + environment.expirationTime;
  }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(CURRENT_USER);
    window.sessionStorage.removeItem(PANIER_KEY);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): any {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public savePanier(panier: any) {
    window.sessionStorage.removeItem(PANIER_KEY);
    window.sessionStorage.setItem(PANIER_KEY, panier);
  }

  public ResetPanier(): any {
    return sessionStorage.removeItem(PANIER_KEY);
  }

  public getPanier(): any {
    return sessionStorage.getItem(PANIER_KEY);
  }

  public getCurrentUser(): any {
    return sessionStorage.getItem(CURRENT_USER);
  }

  public saveCurrentUser(currentUser: any) {
    window.sessionStorage.removeItem(CURRENT_USER);
    window.sessionStorage.setItem(CURRENT_USER, currentUser);
  }
}
