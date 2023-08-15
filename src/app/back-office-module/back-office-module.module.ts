import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackOfficeModuleRoutingModule } from './back-office-module-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { BackOfficeComponent } from './components/back-office/back-office.component';
import { ListMealComponent } from './components/list-meal/list-meal.component';
import { ListDrinkComponent } from './components/list-drink/list-drink.component';
import { LivrerCommandesComponent } from './components/livrer-commandes/livrer-commandes.component';
import { ListIngredientComponent } from './components/list-ingredient/list-ingredient.component';
import { EnregistrerMenuComponent } from './components/enregistrer-menu/enregistrer-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListCustomerComponent } from './components/list-customer/list-customer.component';
import { ListPaymentComponent } from './components/list-payment/list-payment.component';

@NgModule({
  declarations: [
    ListUsersComponent,
    BackOfficeComponent,
    ListDrinkComponent,
    ListMealComponent,
    LivrerCommandesComponent,
    ListIngredientComponent,
    EnregistrerMenuComponent,
    ListCustomerComponent,
    ListPaymentComponent,
  ],
  imports: [
    CommonModule,
    BackOfficeModuleRoutingModule,
    SharedModuleModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
})
export class BackOfficeModuleModule {}
