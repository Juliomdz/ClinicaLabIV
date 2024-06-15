import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './turnos/turnos.component';

const routes: Routes = [
  {
    path:"",
    component:TurnosComponent
  },
  {
    path:"mis-turnos",
    component:MisTurnosComponent
  },
  {
    path:"solicitar-turno",
    component:SolicitarTurnoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
