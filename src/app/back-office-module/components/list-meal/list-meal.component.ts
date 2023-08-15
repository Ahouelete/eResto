import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Food } from 'src/app/models/food';
import { Ingredient } from 'src/app/models/ingredient';
import { FoodService } from 'src/app/providers/foodServices';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';

@Component({
  selector: 'app-list-meal',
  templateUrl: './list-meal.component.html',
  styleUrls: ['./list-meal.component.css'],
})
export class ListMealComponent implements OnInit {
  foods: Food[] = [];
  ingredients: Ingredient[] = [];
  saveButtonName = 'Enregistrer';
  action = 'ON_CREATE';
  foodForm!: FormGroup;
  ingredientForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;

  constructor(
    private foodService: FoodService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createFoodForm();
    this.createIngredientFormForm();
    this.allFood(this.pageNo, this.pageSize);
  }

  allFood(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.foodService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.foods = data.object.content;
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
    this.allFood(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.ingredients = [];
    this.ingredientForm.reset();
    this.foodForm.reset();
  }

  onUpdate(food: Food) {
    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.ingredients = <[]>food.ingredients;
    this.foodForm.setValue(food);
  }

  onUpdateIngredient(ingredient: Ingredient) {
    this.ingredientForm.setValue(ingredient);

    const position = this.ingredients.findIndex(
      (ingred: Ingredient) => ingred.name == ingredient.name
    );

    this.ingredients.splice(position, position > -1 ? 1 : 0);
  }

  ajouterIngredient(ingredient: Ingredient) {
    const position = this.ingredients.findIndex(
      (ingred: Ingredient) => ingred.name == ingredient.name
    );

    if (position > -1) {
      this.swalService.message(
        'Cet ingredient figure déjà dans la liste',
        TYPE_ERROR.ERROR
      );
      return;
    }

    this.ingredients.unshift(ingredient);

    this.foodForm.controls['ingredients'].setValue(
      this.ingredients.length > 0 ? this.ingredients : null
    );

    this.ingredientForm.reset();
  }

  onDelete(food: Food) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette nourriture ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteFood(food);
      }
    });
  }

  onDeleteIngredient(ingredient: Ingredient) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir retirer cet ingredient ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        const position = this.ingredients.findIndex(
          (ingred: Ingredient) => ingred.name == ingredient.name
        );

        this.ingredients.splice(position, position > -1 ? 1 : 0);
      }
    });
  }

  createFoodForm() {
    this.foodForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      ingredients: [null, [Validators.required]],
    });
  }

  createIngredientFormForm() {
    this.ingredientForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
    });
  }

  onSave(food: Food) {
    food.ingredients = this.ingredients;

    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';
        this.createFood(food);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateFood(food);
        break;

      default:
        break;
    }
  }

  createFood(food: Food) {
    const responseApi$: Observable<any> = this.foodService.create(food);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.foods.unshift(data.object);
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

  updateFood(food: Food) {
    const responseApi$: Observable<any> = this.foodService.update(
      food.id,
      food
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.foods.findIndex((d) => d.id == food.id);
          this.foods.splice(
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

  deleteFood(food: Food) {
    const responseApi$: Observable<any> = this.foodService.delete(food.id);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.foods.findIndex((d) => d.id == food.id);
          this.foods.splice(
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
