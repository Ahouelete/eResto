import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Customer } from 'src/app/models/customer';
import { Person } from 'src/app/models/person';
import { ROLES_NAME, Role } from 'src/app/models/roles';
import { User } from 'src/app/models/user';
import { CustomerService } from 'src/app/providers/customerServices';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/providers/globalService';
import { UserService } from 'src/app/providers/userService';

export interface CustomerDTO {
  id: number | null | undefined;
  lastName: string;
  firstName: string;
  roles: Role[];
  email: string;
  adress: string;
}

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css'],
})
export class ListCustomerComponent implements OnInit {
  roles: any[] = [];
  customers: any[] = [];
  action = 'ON_CREATE';
  customerForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  currentCustomer!: Customer | null;
  saveButtonName = 'Enregistrer';

  constructor(
    private customerService: CustomerService,
    private swalService: SwalService,
    private userService: UserService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createCustomerForm();
    this.allRoles();
    this.allCustomer(this.pageNo, this.pageSize);
  }

  allCustomer(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.customerService.all(this.pageNo, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.customers = data.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  allRoles() {
    this.userService.getRoles(0, 10).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.roles = data.object.content;
        }
      },
    });
  }

  getRoleName(roles: Role[]) {
    let roleName = 'Client';
    const rolesName = roles.map((r) => r.name);

    if (rolesName.includes(ROLES_NAME.ROLE_ADMIN)) roleName = 'Administrateur';

    return roleName;
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allCustomer(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.currentCustomer = null;

    this.customerForm.reset();
  }

  onUpdate(customer: Customer) {
    this.currentCustomer = customer;

    const customerDTO: CustomerDTO = {
      id: customer.id,
      lastName: customer.user.person.lastName,
      firstName: customer.user.person.firstName,
      roles: customer.user.roles,
      email: customer.user.person.email,
      adress: customer.adress,
    };

    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.customerForm.setValue(customerDTO);
  }

  onDelete(customer: Customer) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette boissons ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteCustomer(customer);
      }
    });
  }

  createCustomerForm() {
    this.customerForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required]],
      lastName: [null],
      roles: [null, [Validators.required]],
      email: [null, [Validators.required]],
      adress: [null, [Validators.required]],
    });
  }

  compareFn(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  onSave(customerDTO: CustomerDTO) {
    const person: Person = {
      id:
        this.action == 'ON_CREATE'
          ? null
          : this.currentCustomer?.user.person?.id,
      lastName: customerDTO.lastName,
      firstName: customerDTO.firstName,
      email: customerDTO.email,
    };

    const user: User = {
      id: this.action == 'ON_CREATE' ? null : this.currentCustomer?.user.id,
      username: customerDTO.email,
      roles: customerDTO.roles,
      person,
      active: true,
    };

    const customer: Customer = {
      id: this.action == 'ON_CREATE' ? null : this.currentCustomer?.id,
      user,
      adress: customerDTO.adress,
    };

    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';
        this.createCustomer(customer);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateCustomer(customer);
        break;

      default:
        break;
    }
  }

  createCustomer(customer: Customer) {
    const responseApi$: Observable<any> = this.customerService.create(customer);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.customers.unshift(data.object);
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);

          this.onCreate();
        } else {
          this.saveButtonName = 'Enregistrer';
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'Enregistrer';
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  updateCustomer(customer: Customer) {
    const responseApi$: Observable<any> = this.customerService.update(
      customer.id as number,
      customer
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.customers.findIndex((d) => d.id == customer.id);
          this.customers.splice(
            position > -1 ? position : 0,
            position > -1 ? 1 : 0,
            data.object
          );

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.onCreate();
        } else {
          this.saveButtonName = 'Modifier';
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'Modifier';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  deleteCustomer(customer: Customer) {
    const responseApi$: Observable<any> = this.customerService.delete(
      customer.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.customers.findIndex((d) => d.id == customer.id);
          this.customers.splice(
            position > -1 ? position : 0,
            position > -1 ? 1 : 0
          );

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.onCreate();
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
}
