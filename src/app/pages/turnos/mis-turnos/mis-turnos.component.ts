import { Component,OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NotificationService } from 'app/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  //Historial clinico
import { FirestoreService } from 'app/services/firestore.service';


@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {

  usuario: any = null;
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
  loading: boolean = false;
  turnList: any[] = [];
  currentSpecialistTurnList: any[] = [];
  usuarioLogueado: any;

  botonesEspecialidad: boolean = false;
  filtroEspecialidad: boolean = false;
  listaPorEspecialidad: any[] = [];

  vistaListadoDeEspecialistas: boolean = false;
  listaDeEspecialistas: any[] = [];
  listaPorEspecialista: any[] = [];

  cancelacionTurno: boolean = false;
  comentarioCancelacion: string = '';
  turnoACancelar: any = {};

  turnosDelPaciente: any[] = [];
  turnosDelEspecialista: any[] = [];
  pacientesDelEspecialista: any[] = [];
  auxPacientesDelEspecialista: any[] = [];

  vistaComentario: boolean = false;
  turnoACalificar: any = {};
  vistaComentarioCalificacion: boolean = false;
  comentarioCalificacion: string = '';

  botonCancelar: boolean = true;
  botonRechazar: boolean = true;
  confirmacionRechazo: boolean = false;
  confirmacionFinalizacion: boolean = false;
  comentarioFinalizacion: string = '';
  turnoAFinalizar: any = {};

  turnoFinalizado: any = {};

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  constructor(
    private authService:AuthService,
    private notificationService:NotificationService,
    private formBuilder:FormBuilder,
    private firestoreService:FirestoreService
  ) {}

  ngOnInit(): void {
    this.loading = true
    this.authService.user$.subscribe((user:any) => {
      if(user)
      {
        this.usuarioLogueado = user;
        if(this.authService.esEspecialista)
        {
          this.esEspecialista = true
        }
        else{
          this.esPaciente = true
        }
        this.loadTurns(); // Cargar los turnos después de obtener el usuario logueado
      }
      this.loading = false;
    })
  }

  loadTurns() {
    this.firestoreService.ObtenerListadoTurnos().subscribe((turns: any) => {
      this.currentSpecialistTurnList = turns;
      this.turnList = [];
      this.turnosFiltrados = [];
      this.turnosDelPaciente = [];
      this.turnosDelEspecialista = [];
      this.pacientesDelEspecialista = [];
      this.auxPacientesDelEspecialista = [];

      let turnsLength = turns?.length ?? 0;
      let auxPacientesDelEspecialistaLength = this.auxPacientesDelEspecialista?.length ?? 0;
      
      for (let i = 0; i < turnsLength; i++) {
        const turnSpecialist = turns[i].turnos;
        let turnSpecialistLength = turnSpecialist?.length ?? 0;
        for (let j = 0; j < turnSpecialistLength; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado !== 'disponible') {
            this.turnList.push(turn);
            if (turn.paciente?.id === this.usuarioLogueado?.id) {
              this.turnosDelPaciente.push(turn);
            }
            if (turn.especialista?.id === this.usuarioLogueado?.id) {
              this.turnosDelEspecialista.push(turn);
              this.auxPacientesDelEspecialista.push(turn.paciente);
            }
          }
        }
      }

      for (let i = 0; i < auxPacientesDelEspecialistaLength; i++) {
        const paciente = this.auxPacientesDelEspecialista[i];
        const index = this.pacientesDelEspecialista.findIndex((p) => paciente.id === p.id);
        if (index === -1) {
          this.pacientesDelEspecialista.push(paciente);
        }
      }

      if (this.esPaciente) {
        this.turnosFiltrados = [...this.turnosDelPaciente];
      } else if (this.esEspecialista) {
        this.turnosFiltrados = [...this.turnosDelEspecialista];
      }

      this.loading = false;
    });
    this.firestoreService.TraerUsuarios().subscribe((users) => {
      this.loading = false;
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u:any) => u.perfil == 'Especialista' && u.aprobado
        );
      }
    });
  }

  verComentario(turno: any) {
    this.turnoACancelar = { ...turno };
    this.vistaComentario = true;
    this.cancelacionTurno = false;
    this.vistaComentarioCalificacion = false;
    this.botonCancelar = true;
    this.confirmacionFinalizacion = false;
  }

  rechazarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.botonCancelar = !this.botonCancelar;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.cancelacionTurno = true;
    this.confirmacionRechazo = true;
    this.confirmacionFinalizacion = false;
  }

  aceptarTurno(turno: any) {
    turno.estado = 'aceptado';
    let currentSpecialistTurnListLength = this.currentSpecialistTurnList?.length ?? 0;
    for (let i = 0; i < currentSpecialistTurnListLength; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.vistaComentario = false;
      this.vistaComentarioCalificacion = false;
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.showSuccess("Mis Turnos","Turno aceptado exitosamente!")
    }, 1000);
  }

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
  }

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentarioPaciente = this.comentarioCancelacion;
      let currentSpecialistTurnListLength = this.currentSpecialistTurnList?.length ?? 0;
      for (let i = 0; i < currentSpecialistTurnListLength; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
      }

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess("El turno fue cancelado","Mis Turnos");
      }, 1000);
    }
  }

  finalizarTurno(turno: any) {
    this.turnoAFinalizar = { ...turno };
    this.confirmacionFinalizacion = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
  }

  confirmarFinalizacion(turno: any) {
    turno.estado = 'realizado';
    turno.comentario = this.comentarioFinalizacion;
    let currentSpecialistTurnListLength = this.currentSpecialistTurnList?.length ?? 0;
    for (let i = 0; i < currentSpecialistTurnListLength; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.turnoACancelar = {};
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.showSuccess("Turno aceptado exitosamente!","Mis Turnos")
    }, 1000);
  }

  calificarTurno(turno: any) {
    this.turnoACalificar = { ...turno };
    this.vistaComentarioCalificacion = true;
    this.vistaComentario = false;
    this.confirmacionFinalizacion = false;
  }

  confirmarCalificacion(turno: any) {
    if (this.comentarioCalificacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario para calificar.',
        'Mis Turnos'
      );
    } else {
      turno.comentarioPaciente = this.comentarioCalificacion;
      let currentSpecialistTurnListLength = this.currentSpecialistTurnList?.length ?? 0;
      for (let i = 0; i < currentSpecialistTurnListLength; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
      }

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.turnoACalificar = {};
        this.vistaComentarioCalificacion = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess("Turno aceptado exitosamente!","Mis Turnos")
      }, 1000);
    }
  }

  cancelarTurnoEspecialista(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
  }

  confirmarCancelacionRechazoEspecialista(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación o rechazo',
        'Turnos'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentario = this.comentarioCancelacion;
      let currentSpecialistTurnListLength = this.currentSpecialistTurnList?.length ?? 0;
      for (let i = 0; i < currentSpecialistTurnListLength; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
      }

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionRechazo = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess("El turno fue cancelado","Mis Turnos");
      }, 1000);
    }
  }

  filtrarPorCamposPaciente() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnosDelPaciente];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      let turnosDelPacienteLength = this.turnosDelPaciente?.length ?? 0;
      for (let i = 0; i < turnosDelPacienteLength; i++) {
        const turno = this.turnosDelPaciente[i];
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toLocaleLowerCase().includes(busqueda) ||
          fechaBusqueda.includes(busqueda) ||
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  filtrarPorCamposEspecialista() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnosDelEspecialista];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      let turnosDelEspecialistaLength = this.turnosDelEspecialista?.length ?? 0;
      for (let i = 0; i < turnosDelEspecialistaLength; i++) {
        const turno = this.turnosDelEspecialista[i];
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toLocaleLowerCase().includes(busqueda) ||
          fechaBusqueda.includes(busqueda) ||
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  transformarFechaParaBusqueda(value: any) {
    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-0' + value.getDate();
    } else {
      rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
    }
    return rtn;
  }

}
