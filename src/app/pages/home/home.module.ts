import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorComponent } from './error/error.component';
import { SeccionUsuariosComponent } from './seccion-usuarios/seccion-usuarios.component';
import { ComponentsModule } from 'app/components/components.module';


@NgModule({
  declarations: [
    WelcomeComponent,
    ErrorComponent,
    SeccionUsuariosComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
