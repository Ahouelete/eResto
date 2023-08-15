import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { PAYMENT_STATUS, Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/providers/paymentService';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.css'],
})
export class ListPaymentComponent implements OnInit {
  payments: Payment[] = [];
  slicePayments: Payment[] = [];
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  status_payment = 'TOUS';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.allPayment(this.pageNo, this.pageSize);
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allPayment(event.page, this.pageSize);
  }

  allPayment(pageIndex: number, pageSize: number) {
    this.loading = true;
    const payment$: Observable<any> = this.paymentService.all(
      pageIndex,
      pageSize
    );

    payment$.subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.slicePayments = data.object.content;
          this.payments = this.slicePayments;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  filterPayment(status: string) {
    this.status_payment = status;

    if (status == 'TOUS') {
      this.payments = [...this.slicePayments];
      return;
    }

    if (status == 'VALIDER') {
      this.payments = this.slicePayments.filter(
        (payment) => payment.paymentStatus == PAYMENT_STATUS.SUCCESS
      );
      return;
    }

    if (status == 'ANNULER') {
      this.payments = this.slicePayments.filter(
        (payment) =>
          payment.paymentStatus == PAYMENT_STATUS.REFUNDED ||
          payment.paymentStatus == PAYMENT_STATUS.FAILED
      );
      return;
    }

    if (status == 'PENDING') {
      this.payments = this.slicePayments.filter(
        (payment) => payment.paymentStatus == PAYMENT_STATUS.PENDING
      );
      return;
    }
  }
}
