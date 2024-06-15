import { Component,OnInit } from '@angular/core';
import { Usuario } from 'app/classes/usuario';
import { AuthService } from 'app/services/auth.service';
import { FirestoreService } from 'app/services/firestore.service';
import { SwalService } from 'app/services/swal.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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

  descargarExcel() {
    const listadoAGuardar: any[] = [];
    this.listadoUsuarios.forEach((user: any) => {
      const usuario: any = {};
      if (user.obraSocial) {
        usuario.perfil = "PACIENTE";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.email = user.email;
        usuario.dni = user.dni;
        usuario.obraSocial =user.obraSocial;
        listadoAGuardar.push(usuario);
      }
      else if (user.especialidad) {
        usuario.perfil = "ESPECIALISTA";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.email = user.email;
        usuario.dni = user.dni;
        user.especialidad?.forEach((especialidad: any, index: number) => {
          if (especialidad != undefined) {
            if (index == 0) {
              usuario.especialidad = ""
            }
            usuario.especialidad += especialidad.nombre;

            if (index !== user.especialidad.length - 1) {
              usuario.especialidad += " - ";
            }
          }
        });
        listadoAGuardar.push(usuario);
      }
      else
      {
        usuario.perfil = "ADMINISTRADOR";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.email = user.email;
        usuario.dni = user.dni;
        listadoAGuardar.push(usuario);
      }
    });
    this.exportAsExcelFile(listadoAGuardar, 'Usuario-Clinica');
    this.swal.MostrarExito("EXITO","Se descargo el lista de usuarios")
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
