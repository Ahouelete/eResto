import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TYPE_ERROR } from './swalService';

@Injectable()
export class GlobalService {
  constructor() {}

  formatDate(date: Date) {
    return new Intl.DateTimeFormat().format(date);
  }

  formatNumber(money: number) {
    return new Intl.NumberFormat().format(money);
  }

  toogleLoading() {
    const loadingCustom = window.document.querySelector(
      '.loading-custom'
    ) as HTMLElement;

    loadingCustom.classList.toggle('active');
  }

  handleErrorHttp(error: HttpErrorResponse) {
    const errorMsg = error.message
      ? error.message
      : error.error.message
      ? error.error.message
      : "Une erreur innattendue s'est produite";

    return errorMsg;
  }
}
