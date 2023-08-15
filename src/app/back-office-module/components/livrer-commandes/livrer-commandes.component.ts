import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse';
import { InvoiceService } from 'src/app/providers/invoiceService';
import { Observable } from 'rxjs';
import { Invoice } from 'src/app/models/invoice';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { GlobalService } from 'src/app/providers/globalService';

export enum STATUT_ORDER {
  TOUS = 'TOUS',
  NON_LIVRER = 'NON_LIVRER',
  LIVRER = 'LIVRER',
  ANNULER = 'ANNULER',
}

@Component({
  selector: 'app-livrer-commandes',
  templateUrl: './livrer-commandes.component.html',
  styleUrls: ['./livrer-commandes.component.css'],
})
export class LivrerCommandesComponent implements OnInit {
  statut_order = STATUT_ORDER.TOUS;
  loading = true;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  invoices: Invoice[] = [];
  sliceInvoices: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private swalService: SwalService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.allOrders(0, 10);
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allOrders(event.page, this.pageSize);
  }

  allOrders(pageIndex: number, pageSize: number) {
    this.loading = true;
    const invoices$: Observable<any> = this.invoiceService.all(
      pageIndex,
      pageSize
    );

    invoices$.subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.sliceInvoices = data.object.content;
          this.filterInvoice(STATUT_ORDER.TOUS);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  filterInvoice(status: string) {
    this.statut_order = status as STATUT_ORDER;

    if (status == STATUT_ORDER.TOUS) {
      this.invoices = [...this.sliceInvoices];
      return;
    }
    this.invoices = this.sliceInvoices.filter(
      (invoice) => invoice.status == status
    );
  }

  onDeliver(invoice: Invoice) {
    this.swalService
      .messageYesNo(
        'Êtes-vous sûr?',
        'Êtes-vous sûr de vouloir livrer cette commande?',
        'Non',
        'Oui! Livrer'
      )
      .then((willsuccess) => {
        if (willsuccess) {
          this.delivrer(invoice);
        }
      });
  }

  onCancel(invoice: Invoice) {
    this.swalService
      .messageYesNo(
        'Êtes-vous sûr?',
        'Êtes-vous sûr de vouloir annuler cette commande?',
        'Non',
        'Oui! Annuler'
      )
      .then((willsuccess) => {
        if (willsuccess) {
          this.cancel(invoice);
        }
      });
  }

  cancel(invoice: Invoice) {
    const invoice$: Observable<any> = this.invoiceService.delete(
      invoice.id as number
    );

    invoice$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.retirerElement(invoice);
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  delivrer(invoice: Invoice) {
    const invoice$: Observable<any> = this.invoiceService.update(
      invoice.id as number,
      { ...invoice, status: 'LIVRER' }
    );

    invoice$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.retirerElement(invoice, { ...invoice, status: 'LIVRER' });
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  retirerElement(deletedInvoice: Invoice, insertedInvoice?: Invoice) {
    const position = this.invoices.findIndex(
      (invoice) => invoice.id == deletedInvoice.id
    );

    insertedInvoice
      ? this.invoices.splice(position, position > -1 ? 1 : 0, insertedInvoice)
      : this.invoices.splice(position, position > -1 ? 1 : 0);
  }
}
