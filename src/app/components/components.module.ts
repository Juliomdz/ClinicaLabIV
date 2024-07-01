import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsRoutingModule } from './components-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FormAltaPacienteComponent } from './form-alta-paciente/form-alta-paciente.component';
import { FormAltaEspecialistaComponent } from './form-alta-especialista/form-alta-especialista.component';
import { FormAltaAdministradorComponent } from './form-alta-administrador/form-alta-administrador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaEspecialidadesComponent } from './lista-especialidades/lista-especialidades.component';
import { InicioUsuariosComponent } from './inicio-usuarios/inicio-usuarios.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { BotonHoverDirective } from '../directives/boton-hover.directive';
import { InputBusquedaDirective } from '../directives/input-busqueda.directive';
import { FechaActualPipe } from '../pipes/fecha-actual.pipe';
import { HorarioTurnoPipe } from '../pipes/horario-turno.pipe';
import { FechaTurnoPipe } from '../pipes/fecha-turno.pipe';
import { DiaTurnoPipe } from '../pipes/dia-turno.pipe';
import { DniPipe } from '../pipes/dni.pipe';
import { ComentarioPipe } from '../pipes/comentario.pipe';
import { TarjetaHoverDirective } from '../directives/tarjeta-hover.directive';

@NgModule({
  declarations: [
    NavbarComponent,
    FormAltaPacienteComponent,
    FormAltaEspecialistaComponent,
    FormAltaAdministradorComponent,
    ListaEspecialidadesComponent,
    InicioUsuariosComponent,
    BotonHoverDirective,
    InputBusquedaDirective,
    TarjetaHoverDirective,
    FechaActualPipe,
    HorarioTurnoPipe,
    FechaTurnoPipe,
    DiaTurnoPipe,
    DniPipe,
    ComentarioPipe
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    RecaptchaModule,
    FormsModule,
    RecaptchaFormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    NavbarComponent,
    FormAltaEspecialistaComponent,
    FormAltaPacienteComponent,
    FormAltaAdministradorComponent,
    InicioUsuariosComponent,
    BotonHoverDirective,
    TarjetaHoverDirective,
    InputBusquedaDirective,
    DiaTurnoPipe,
    HorarioTurnoPipe,
    FechaTurnoPipe,
    FechaActualPipe,
    DniPipe,
    ComentarioPipe
  ]
})
export class ComponentsModule { }
