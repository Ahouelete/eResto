import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  DoCheck,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Drink } from 'src/app/models/drink';
import { Food } from 'src/app/models/food';
import { Menu } from 'src/app/models/menu';
import { DrinkService } from 'src/app/providers/drinkServices';
import { FoodService } from 'src/app/providers/foodServices';
import { GlobalService } from 'src/app/providers/globalService';
import { MenuService } from 'src/app/providers/menuService';
import { TokenStorage } from 'src/app/utilis/token.storage';
import { Observable } from 'rxjs';

export enum Jour {
  AUJOURDHUI = 'AUJOURDHUI',
  DEMAIN = 'DEMAIN',
}

export enum Type {
  DRINK = 'DRINK',
  FOOD = 'FOOD',
}

export interface PanierModel {
  product: any;
  type: Type;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges, DoCheck
{
  //DECLARATION DE VARIABLES
  quantityPanier: number = 0;
  amountPanier: number = 0;
  newProductToPanier!: PanierModel | null;
  panierForm!: FormGroup;
  drinks: Drink[] = [];
  foods: Food[] = [];
  menus: Menu[] = [];
  menu!: Menu;
  displayBasic = false;
  jour_du_menu = Jour.AUJOURDHUI;

  private observer!: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private tokenStorage: TokenStorage,
    private route: Router,
    private drinkService: DrinkService,
    private foodService: FoodService,
    private globalService: GlobalService,
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createPanierForm();

    this.getPanier();
    this.getAllDrink();
    this.allMenu();
    //this.getallFood();

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting == true) {
          entries[0].target.classList.add('appear-element');
        } else {
          entries[0].target.classList.remove('appear-element');
        }
      },
      {
        threshold: 0.7,
        rootMargin: '20px',
      }
    );

    const notreVision$ = window.document.querySelector('#notre-vision .anim');
    this.observer.observe(notreVision$ as HTMLElement);
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getallFood() {
    this.foodService.mocks().subscribe({
      next: (data) => {
        this.foods = data.object;
      },
    });
  }

  getAllDrink() {
    const drinkResponse$: Observable<any> = this.activatedRoute.data;

    drinkResponse$.subscribe({
      next: (apiResponse: any) => {
        if (apiResponse.drinkResolver$ && apiResponse.drinkResolver$.success) {
          this.drinks = apiResponse.drinkResolver$.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  displayMenu(jour: string) {
    switch (jour) {
      case Jour.AUJOURDHUI:
        this.jour_du_menu = Jour.AUJOURDHUI;
        this.menu = this.menus[this.menus.length < 2 ? 0 : 1];
        break;

      case Jour.DEMAIN:
        this.jour_du_menu = Jour.DEMAIN;
        this.menu = this.menus[0];
        break;

      default:
        this.jour_du_menu = Jour.AUJOURDHUI;
        this.menu = this.menus[this.menus.length < 2 ? 0 : 1];
        break;
    }
  }

  gotoDecouvrerNosMenus(): void {
    const $element = window.document.getElementById(
      'decouvrer-nos-menus'
    ) as HTMLElement;
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  allMenu() {
    this.globalService.toogleLoading();
    const menuResponse$: Observable<any> = this.activatedRoute.data;

    menuResponse$.subscribe({
      next: (apiResponse: any) => {
        if (apiResponse.menuResolver$ && apiResponse.menuResolver$.success) {
          const menu = apiResponse.menuResolver$.object.content.sort(
            (a: any, b: any) => b.id - a.id
          );
          this.menus = menu.slice(0, 2);

          this.displayMenu(Jour.AUJOURDHUI);
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  createPanierForm() {
    this.panierForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [0],
    });
  }

  changeQuantity(amount: number) {
    const quantity = this.panierForm.controls['quantity'].value;

    const total = quantity * amount;

    this.panierForm.controls['amount'].setValue(total);
  }

  formatNumber(money: number) {
    return this.globalService.formatNumber(money);
  }

  addNewProductToPanier(product: Food | Drink, type: string) {
    this.newProductToPanier = { product: product, type: type as Type };

    this.panierForm.setValue({ quantity: 1, amount: product.amount });

    this.displayBasic = true;
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

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting == true) {
            entry.target.classList.add('appear-element');
          } else {
            entry.target.classList.remove('appear-element');
          }
        });
      },
      {
        rootMargin: '0px',
      }
    );

    const menu$ = document.querySelectorAll(
      '.home-page .container-decouvrer-nos-menus .menu'
    );

    menu$.forEach((menu) => {
      this.observer.observe(menu);
    });
  }

  ngDoCheck(): void {}

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
