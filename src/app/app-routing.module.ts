import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompositionMenuComponent } from './components/composition-menu/composition-menu.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FoodResolver } from './resolver/foodResolver';
import { AuthGuard } from './utilis/AuthGuard';
import { MenuResolver } from './resolver/menuResolver';
import { DrinkResolver } from './resolver/drinkResolver';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    children: [
      {
        path: '',
        component: HomeComponent,
        resolve: {
          menuResolver$: MenuResolver,
          drinkResolver$: DrinkResolver,
        },
      },
      {
        path: 'menu/:food_id',
        component: CompositionMenuComponent,
        resolve: {
          foodResolver$: FoodResolver,
        },
      },
    ],
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  {
    path: 'reset-password/:resetPasswordToken/:username',
    component: LoginComponent,
  },

  {
    path: 'user-account',
    loadChildren: () =>
      import('../app/user-account-module/user-account-module.module').then(
        (m) => m.UserAccountModuleModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'back-office',
    loadChildren: () =>
      import('../app/back-office-module/back-office-module.module').then(
        (m) => m.BackOfficeModuleModule
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
