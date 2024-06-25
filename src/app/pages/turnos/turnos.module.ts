import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosRoutingModule } from './turnos-routing.module';
import { ComponentsModule } from 'app/components/components.module';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosComponent } from './turnos/turnos.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosComponent,
    SolicitarTurnoComponent,

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TurnosRoutingModule,
    ComponentsModule
  ]
})
export class TurnosModule { }
