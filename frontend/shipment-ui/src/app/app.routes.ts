import {Routes} from '@angular/router';
import {Dashboard} from './layout/dashboard/dashboard';

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

  {path: 'dashboard', component: Dashboard}

];
