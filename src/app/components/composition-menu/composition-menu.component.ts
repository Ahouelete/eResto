import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Drink } from 'src/app/models/drink';
import { Food } from 'src/app/models/food';
import { GlobalService } from 'src/app/providers/globalService';
import { TokenStorage } from 'src/app/utilis/token.storage';
import { PanierModel, Type } from '../home/home.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from 'src/app/providers/foodServices';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-composition-menu',
  templateUrl: './composition-menu.component.html',
  styleUrls: ['./composition-menu.component.css'],
})
export class CompositionMenuComponent implements OnInit, AfterViewInit {
  displayBasic = false;
  quantityPanier: number = 0;
  amountPanier: number = 0;
  newProductToPanier!: PanierModel | null;
  panierForm!: FormGroup;
  foods: Food[] = [];
  food!: Food;

  constructor(
    private tokenStorage: TokenStorage,
    private route: Router,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createPanierForm();
    this.getFood();
  }

  ngAfterViewInit(): void {}

  getListFood() {
    const foodList$: Observable<any> = this.foodService.mocks();

    foodList$.subscribe({
      next: (data: ApiResponse) => {
        this.foods = data.object;
        //this.getFood(this.foods);
      },
    });
  }

  getFood() {
    this.globalService.toogleLoading();
    const foodResponse$: Observable<any> = this.activatedRoute.data;

    foodResponse$.subscribe({
      next: (apiResponse: any) => {
        if (apiResponse.foodResolver$ && apiResponse.foodResolver$.success) {
          this.food = apiResponse.foodResolver$.object;
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  addNewProductToPanier(product: Food | Drink, type: string) {
    this.newProductToPanier = { product: product, type: type as Type };

    this.panierForm.setValue({ quantity: 1, amount: product.amount });

    this.displayBasic = true;
  }

  createPanierForm() {
    this.panierForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [0],
    });
  }

  addProductInPanier(formData: any, action: string) {
    const product = {
      product: { ...this.newProductToPanier },
      quantity: formData.quantity,
    };

    //get products in panier
    const panier = JSON.parse(this.tokenStorage.getPanier());

    let products: Array<any> = [];

    if (panier && panier.products) {
      products = [...panier.products];
    }

    const index = products.findIndex(
      (p) =>
        p.product.product.id == product.product.product.id &&
        p.product.type == product.product.type
    );

    console.log(index);
    if (index > -1) {
      products[index].quantity = products[index].quantity + product.quantity;
    } else {
      products.unshift({ ...product });
    }

    this.tokenStorage.savePanier(JSON.stringify({ products }));

    this.getPanier();

    this.panierForm.reset();
    this.displayBasic = false;
    this.newProductToPanier = null;

    if (action == 'PAYMENT') {
      this.route.navigateByUrl('payment');
    }
  }

  getPanier() {
    const panier = JSON.parse(this.tokenStorage.getPanier());

    let list: Array<any> = [];
    if (panier && panier.products) {
      list = panier.products;
    }

    let quantityTotal = 0;
    let amountTotal = 0;
    list.forEach((element) => {
      quantityTotal = quantityTotal + element.quantity;
      amountTotal =
        amountTotal + element.quantity * element.product.product.amount;
    });

    this.quantityPanier = quantityTotal;
    this.amountPanier = amountTotal;
  }

  changeQuantity(amount: number) {
    const quantity = this.panierForm.controls['quantity'].value;

    const total = quantity * amount;

    this.panierForm.controls['amount'].setValue(total);
  }

  formatNumber(money: number) {
    return this.globalService.formatNumber(money);
  }
}
