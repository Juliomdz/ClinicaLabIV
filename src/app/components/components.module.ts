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


@NgModule({
  declarations: [
    NavbarComponent,
    FormAltaPacienteComponent,
    FormAltaEspecialistaComponent,
    FormAltaAdministradorComponent,
    ListaEspecialidadesComponent,
    InicioUsuariosComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    NavbarComponent,
    FormAltaEspecialistaComponent,
    FormAltaPacienteComponent,
    FormAltaAdministradorComponent,
    InicioUsuariosComponent
  ]
})
export class ComponentsModule { }
