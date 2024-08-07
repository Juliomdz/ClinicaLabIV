import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './turnos/turnos.component';
import { seLogueoGuard } from 'app/guard/se-logueo.guard';

const routes: Routes = [
  {
    path:"",
    component:TurnosComponent
  },
  {
    path:"mis-turnos",
    component:MisTurnosComponent,
    canActivate:[seLogueoGuard],
    data: { animation: 'mis-turnos' }
  },
  {
    path:"solicitar-turno",
    component:SolicitarTurnoComponent,
    canActivate:[seLogueoGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
