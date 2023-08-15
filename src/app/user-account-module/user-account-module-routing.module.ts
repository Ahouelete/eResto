import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';

const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: ListOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountModuleRoutingModule {}
