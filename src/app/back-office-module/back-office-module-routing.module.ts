import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BackOfficeComponent } from './components/back-office/back-office.component';
import { LivrerCommandesComponent } from './components/livrer-commandes/livrer-commandes.component';

const routes: Routes = [
  { path: '', redirectTo: 'record-menu', pathMatch: 'full' },
  { path: 'list-drink', component: BackOfficeComponent },
  { path: 'list-user', component: BackOfficeComponent },
  { path: 'list-meal', component: BackOfficeComponent },
  { path: 'livrer-commandes', component: BackOfficeComponent },
  { path: 'list-ingredient', component: BackOfficeComponent },
  { path: 'list-customer', component: BackOfficeComponent },
  { path: 'list-payment', component: BackOfficeComponent },
  { path: 'record-menu', component: BackOfficeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackOfficeModuleRoutingModule {}
