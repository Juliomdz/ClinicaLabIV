import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loading = true;
  formPaciente:boolean = false;
  formEspecialista:boolean = false;

  ngOnInit(): void {
  this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1600);
  }

  MostrarFormPaciente() {
    this.formPaciente = true;
  }

  MostrarFormEspecialista() {
    this.formEspecialista = true;
  }

  MostrarOpcionesRegistro()
  {
    this.formPaciente = false;
    this.formEspecialista = false;
  }
}
