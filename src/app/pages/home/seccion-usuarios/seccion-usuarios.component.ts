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

  loading:boolean = false;
  usuario: any = null;
  listadoUsuarios: any[] = [];
  historialClinico: any[] = [];
  historialActivo: any[] = [];
  hayHistorial: boolean = false;

  listaTurnos: any[] = [];
  createrUserMenu: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private authService:AuthService,
    private swal:SwalService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.firestoreService.TraerUsuarios().subscribe((users) => {
      this.loading = false;
      if (users) {
        this.listadoUsuarios = users;
      }
      this.firestoreService.ObtenerHistorialesClinicos().subscribe((historial) => {
        this.historialClinico = historial;
        let listadoUsuariosLength = this.listadoUsuarios?.length ?? 0;
        historial.forEach((h) => {
          for (let i = 0; i < listadoUsuariosLength; i++) {
            const usuario = this.listadoUsuarios[i];
            if (usuario.perfil == 'Paciente' && usuario.id == h.paciente.id) {
              this.listadoUsuarios[i].historial = true;
            }
          }
        });
      });
      this.firestoreService.ObtenerListadoTurnos().subscribe((turnos: any) => {
        this.listaTurnos = [];
        let turnosLength = turnos?.length ?? 0;
        for (let i = 0; i < turnosLength; i++) {
          const turnoEspecialista = turnos[i].turnos;
          for (let j = 0; j < turnoEspecialista.length; j++) {
            const t = turnoEspecialista[j];
            this.listaTurnos.push(t);
          }
        }
      });
    });
  }

  CambiarEstado(user: Usuario, option: number) {
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
  VerHistorialPaciente(paciente: any,event:any) {
    this.historialActivo = [];
    let historialClinicoLength = this.historialClinico?.length ?? 0;
    for (let i = 0; i < historialClinicoLength; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
    event.stopPropagation();
  }

  VerTurnosPaciente(usuario: any) {
    const listaTurnosUsuario: any[] = [];
    if (usuario.perfil == 'Paciente') {
      this.listaTurnos.forEach((t: any) => {
        if (usuario.id == t?.paciente?.id) {
          const turno: any = {};
          turno.nombrePaciente = usuario.nombre;
          turno.apellidoPaciente = usuario.apellido;
          turno.fecha = new Date(t.fecha.seconds * 1000);
          turno.especialidad = t.especialidad;
          turno.nombreEspecialista = t.especialista.nombre;
          turno.apellidoEspecialista = t.especialista.apellido;
          listaTurnosUsuario.push(turno);
        }
      });
      if (listaTurnosUsuario.length == 0) {
        this.swal.MostrarAdvertencia(
          'ATENCION',
          'No se han encontrado turnos del paciente'
        );
      } else {
        this.exportAsExcelFile(listaTurnosUsuario, `Turnos-${usuario.nombre}-${usuario.apellido}`);
        this.swal.MostrarExito(
          'EXITO',
          'Se han descargado exitosamente los turnos del paciente',
        );
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

  DescargarExcel() {
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

            if (index !== user.especialidad?.length - 1) {
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
    this.exportAsExcelFile(listadoAGuardar, 'Usuarios-ClinicaOnline');
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
