import { Component,OnInit } from '@angular/core';
import { Usuario } from 'app/classes/usuario';
import { AuthService } from 'app/services/auth.service';
import { FirestoreService } from 'app/services/firestore.service';
import { SwalService } from 'app/services/swal.service';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent implements OnInit{

  listadoUsuarios: any[] = [];
  createrUserMenu: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  loading: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private authService:AuthService,
    private swal:SwalService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.firestoreService.TraerUsuarios().subscribe((users) => {
      if (users) {
        this.loading = false;
        this.listadoUsuarios = users;
      }
    })
  }

  updateUser(user: Usuario, option: number) {
    if (user.perfil == 'Especialista') {
      if (option == 1) {
        user.aprobado = true;
        this.authService.ActualizarUsuario(user);
        this.swal.MostrarExito("EXITO","El especialista fue habilitado")
      } else if (option == 2) {
        user.aprobado = false;
        this.authService.ActualizarUsuario(user);
        this.swal.MostrarExito("EXITO","El especialista fue deshabilitado")
      }
    }
  }

  showCreateUserMenu() {
    this.createrUserMenu = true;
  }

  showUserList() {
    this.createrUserMenu = false;
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }

  goToFormPaciente() {
    this.formPaciente = true;
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
  }

  goToFormAdministrador() {
    this.formAdministrador = true;
  }
    
  goToListado() {
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }
}
