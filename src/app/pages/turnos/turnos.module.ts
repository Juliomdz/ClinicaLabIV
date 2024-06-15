import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosRoutingModule } from './turnos-routing.module';
import { ComponentsModule } from 'app/components/components.module';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosComponent } from './turnos/turnos.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { FormsModule } from '@angular/forms';
import { DayDatePipe } from 'app/pipes/day-date.pipe';
import { DayWithHourPipe } from 'app/pipes/day-with-hour.pipe';

@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosComponent,
    SolicitarTurnoComponent,
    DayDatePipe,
    DayWithHourPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    TurnosRoutingModule,
    ComponentsModule
  ]
})
export class TurnosModule { }
