import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { HasRoleGuard } from './guard/has-role.guard';
import { AdminComponent } from './modules/admin/admin.component';
import { HospitalComponent } from './modules/hospital/hospital.component';
import { KioskComponent } from './modules/hospital/kiosk/kiosk.component';
import { MhuDashboardComponent } from './modules/hospital/mhu-dashboard/mhu-dashboard.component';
// import { MhuComponent } from './modules/hospital/mhu/mhu.component';
import { MvitalsDashboardComponent } from './modules/hospital/mvitals-dashboard/mvitals-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'hospital', component: HospitalComponent },
  { path: 'hospital/kiosk', component: KioskComponent },
  // { path: 'hospital/mhu', component: MhuComponent },
  { path: 'mvitals', redirectTo: 'mvitals/login', pathMatch: 'full' },
  { path: 'mvitals', component: AuthComponent },
  { path: 'mvitals-dashboard', component: MvitalsDashboardComponent, canActivate: [AuthGuard] },
  { path: 'mhu-dashboard', component: MhuDashboardComponent, canActivate: [AuthGuard] },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'mvitals',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminGuard, HasRoleGuard],
    data: { role: [1, 2], type: 'admin' },
  },

  {
    path: 'hospital',
    loadChildren: () =>
      import('./modules/hospital/hospital.module').then(
        (m) => m.HospitalModule,
      ),
    canActivate: [AuthGuard, HasRoleGuard],
    data: { role: [1, 2, 3], type: 'hospital' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
