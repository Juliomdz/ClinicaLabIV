import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorComponent } from './error/error.component';
import { SeccionUsuariosComponent } from './seccion-usuarios/seccion-usuarios.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { seLogueoGuard } from 'app/guard/se-logueo.guard';

const routes: Routes = [
  {
    path:"home",
    component:WelcomeComponent
  },
  {
    path:'usuarios',
    component:SeccionUsuariosComponent,
    canActivate:[seLogueoGuard]
  },
  {
    path:'perfil',
    component:MiPerfilComponent,
    canActivate:[seLogueoGuard],
    data: { animation: 'Perfil' }
  },
  {
    path:"pacientes",
    component:PacientesComponent,
    canActivate:[seLogueoGuard]
  },
  {
    path:"error",
    component:ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }