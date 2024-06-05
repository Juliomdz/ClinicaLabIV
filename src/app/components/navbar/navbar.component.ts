import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { SwalService } from 'app/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  usuario:any

  constructor(public authService:AuthService,private swal:SwalService,private router:Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((user:any) => {
      if(user){
        this.authService.seLogueo = true;
        this.usuario = user
        switch(this.usuario.perfil){
          case "Paciente":
            this.authService.esPaciente = true;
            break;
          case "Especialista":
            this.authService.esEspecilista = true;
            break;
          case "Administrador":
            this.authService.esAdmin = true;
            break;
        }
      }
      else{
        this.usuario = null
      }
    }) 
  }

  CerrarSesion()
  {
    Swal.fire({
      title:"ATENCIÓN",
      text: "¿Estas seguro que desea cerrar la sesion?",
      showCancelButton: true,
      confirmButtonText: 'Salir',
      confirmButtonColor: "red",
      cancelButtonText:"Cancelar",
      cancelButtonColor:"blue",
      icon:"question"
    }).then((res) => {
      if(res.isConfirmed){
        this.authService.Logout()
        this.swal.MostrarExito("EXITO","Su sesión fue cerrada").then(() => {
          this.router.navigate([''])
        })
      }
      else{
        Swal.fire('Se cancelo la operación', '', 'info')
      }
    })
  }
}
