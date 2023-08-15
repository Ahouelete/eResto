import { Injectable } from '@angular/core';

var swal = require('sweetalert');

export enum TYPE_ERROR {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}

@Injectable()
export class SwalService {
  message(message: string, type: TYPE_ERROR) {
    switch (type) {
      case TYPE_ERROR.ERROR:
        swal('Oops!', message, 'error');
        break;

      case TYPE_ERROR.SUCCESS:
        swal('Félicitation !', message, 'success');
        break;

      default:
        break;
    }
  }

  messageYesNo(
    title: string,
    message: string,
    cancel: string,
    continu: string
  ): Promise<boolean> {
    const buttons = [cancel, continu];
    return swal({
      title: title,
      text: message,
      icon: 'warning',
      buttons: [...buttons],
      dangerMode: true,
    });
  }
}
