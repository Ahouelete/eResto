import { NgModule } from '@angular/core';

import { UserAccountModuleRoutingModule } from './user-account-module-routing.module';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [ListOrdersComponent],
  imports: [UserAccountModuleRoutingModule, SharedModuleModule],
})
export class UserAccountModuleModule {}
