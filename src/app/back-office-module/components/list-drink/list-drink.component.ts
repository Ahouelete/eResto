import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Drink } from 'src/app/models/drink';
import { DrinkService } from 'src/app/providers/drinkServices';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';

@Component({
  selector: 'app-list-drink',
  templateUrl: './list-drink.component.html',
  styleUrls: ['./list-drink.component.css'],
})
export class ListDrinkComponent implements OnInit {
  drinks: Drink[] = [];
  action = 'ON_CREATE';
  drinkForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  saveButtonName = 'Enregistrer';

  constructor(
    private drinkService: DrinkService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createDrinkForm();
    this.allDrink(this.pageNo, this.pageSize);
  }

  allDrink(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.drinkService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.drinks = data.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allDrink(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.drinkForm.reset();
  }

  onUpdate(drink: Drink) {
    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.drinkForm.setValue(drink);
  }

  onDelete(drink: Drink) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette boissons ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteDrink(drink);
      }
    });
  }

  createDrinkForm() {
    this.drinkForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
    });
  }

  onSave(drink: Drink) {
    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';

        this.createDrink(drink);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateDrink(drink);
        break;

      default:
        break;
    }
  }

  createDrink(drink: Drink) {
    const responseApi$: Observable<any> = this.drinkService.create(drink);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.drinks.unshift(data.object);

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

  updateDrink(drink: Drink) {
    const responseApi$: Observable<any> = this.drinkService.update(
      drink.id,
      drink
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.drinks.findIndex((d) => d.id == drink.id);
          this.drinks.splice(
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

  deleteDrink(drink: Drink) {
    const responseApi$: Observable<any> = this.drinkService.delete(drink.id);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.drinks.findIndex((d) => d.id == drink.id);
          this.drinks.splice(
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
