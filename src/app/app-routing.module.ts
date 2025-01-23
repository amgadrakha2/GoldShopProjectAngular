import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/Account/login/login.component';
import { RegisterComponent } from './components/Account/register/register.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'order', pathMatch: 'full' },
      { path: 'order', loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule) },
      { path: 'client', loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule) },
      { path: 'item', loadChildren: () => import('./modules/item/item.module').then(m => m.ItemModule) },
      { path: 'report', loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule) },
      { path: 'settings', loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
