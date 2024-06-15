import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorComponent } from './error/error.component';
import { SeccionUsuariosComponent } from './seccion-usuarios/seccion-usuarios.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';

const routes: Routes = [
  {
    path:"home",
    component:WelcomeComponent
  },
  {
    path:'usuarios',
    component:SeccionUsuariosComponent
  },
  {
    path:'perfil',
    component:MiPerfilComponent
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
