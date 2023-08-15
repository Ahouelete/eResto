import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Food } from 'src/app/models/food';
import { Menu } from 'src/app/models/menu';
import { FoodService } from 'src/app/providers/foodServices';
import { GlobalService } from 'src/app/providers/globalService';
import { MenuService } from 'src/app/providers/menuService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { TokenStorage } from 'src/app/utilis/token.storage';

@Component({
  selector: 'app-enregistrer-menu',
  templateUrl: './enregistrer-menu.component.html',
  styleUrls: ['./enregistrer-menu.component.css'],
})
export class EnregistrerMenuComponent implements OnInit {
  menus: any[] = [];
  foods: Food[] = [];
  selectedFoods: Food[] = [];
  loadingFood = false;
  loadingMenu = false;
  totalRecordsMenu = 0;
  totalRecordsFood = 0;
  pageNoFood = 0;
  pageSizeFood = 10;
  pageNoMenu = 0;
  pageSizeMenu = 10;
  menuForm!: FormGroup;
  saveButtonName = 'Enregistrer';
  action = 'ON_CREATE';

  constructor(
    private foodService: FoodService,
    private menuService: MenuService,
    private tokenStorage: TokenStorage,
    private globalService: GlobalService,
    private swalService: SwalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createMenuForm();
    this.allMenu(this.pageNoMenu, this.pageSizeMenu);
    this.allFood(this.pageNoFood, this.pageSizeFood);
  }

  onUpdate(menu: any) {
    const date: string =
      menu.localDate[0] +
      '-' +
      ((menu.localDate[1] + '').length == 1
        ? '0' + menu.localDate[1] + ''
        : menu.localDate[1]) +
      '-' +
      menu.localDate[2];

    this.menuForm.controls['localDate'].setValue(date);
    this.menuForm.controls['id'].setValue(menu.id);
    this.selectedFoods = menu.foods;
    this.action = 'ON_UPDATE';
    this.saveButtonName = 'Modifier';
  }

  onSave(formData: Menu) {
    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';
        this.saveMenu(formData);
        break;

      case 'ON_UPDATE':
        if ((this.saveButtonName = 'Modification en cours ...')) return;
        this.saveButtonName == 'Modification en cours ...';
        this.updateMenu(formData);
        break;

      default:
        break;
    }
  }

  allFood(pageIndex: number, pageSize: number) {
    this.loadingFood = true;

    this.foodService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loadingFood = false;
        if (data.success) {
          this.totalRecordsFood = data.object?.totalElements;
          this.pageNoFood = data.object?.pageable?.pageNumber;
          this.pageSizeFood = data.object?.pageable?.pageSize;
          this.foods = data.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingFood = false;
      },
    });
  }

  allMenu(pageIndex: number, pageSize: number) {
    this.loadingMenu = true;

    this.menuService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loadingMenu = false;
        if (data.success) {
          this.totalRecordsMenu = data.object?.totalElements;
          this.pageNoMenu = data.object?.pageable?.pageNumber;
          this.pageSizeMenu = data.object?.pageable?.pageSize;
          this.menus = data.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingMenu = false;
      },
    });
  }

  createMenuForm() {
    this.menuForm = this.fb.group({
      id: null,
      localDate: [null, [Validators.required]],
      foods: [null],
    });
  }

  all() {
    this.foodService.mocks().subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.foods = data.object;
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  paginateMenu(event: any) {
    this.pageSizeMenu = event.rows;
    this.allFood(event.page, this.pageSizeMenu);
  }

  paginateFood(event: any) {
    this.pageSizeFood = event.rows;
    this.allFood(event.page, this.pageSizeFood);
  }

  onCreate() {
    this.action = 'ON_CREATE';
    this.saveButtonName = 'Enregistrer';
    this.selectedFoods = [];
    this.menuForm.reset();
  }

  onDelete(menu: Menu) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer ce menu ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteMenu(menu);
      }
    });
  }

  saveMenu(formData: any) {
    const menuPayload = {
      id: null,
      foods: this.selectedFoods,
      localDate: formData.localDate,
    };

    const menuResponse$: Observable<any> = this.menuService.create(menuPayload);

    menuResponse$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.menus.unshift(data.object);
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

  updateMenu(formData: any) {
    const menuPayload = {
      id: formData.id,
      foods: this.selectedFoods,
      localDate: formData.localDate,
    };

    const menuResponse$: Observable<any> = this.menuService.create(menuPayload);

    menuResponse$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.menus.findIndex((d) => d.id == menuPayload.id);
          this.menus.splice(
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

  deleteMenu(menu: Menu) {
    const responseApi$: Observable<any> = this.menuService.delete(
      menu.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.menus.findIndex((d) => d.id == menu.id);
          this.menus.splice(
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
