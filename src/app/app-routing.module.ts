import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { seLogueoGuard } from './guard/se-logueo.guard';

const routes: Routes = [
  {
    path:"",
    redirectTo:"/home",
    pathMatch:"full"
  },
  {
    path:"",
    loadChildren:() => import('./pages/home/home.module').then(m => m.HomeModule),
    data:{animation:'Home'}
  },
  {
    path:"auth",
    loadChildren:() => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:"turnos",
    loadChildren:() => import('./pages/turnos/turnos.module').then(m => m.TurnosModule),
    canActivate:[seLogueoGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
