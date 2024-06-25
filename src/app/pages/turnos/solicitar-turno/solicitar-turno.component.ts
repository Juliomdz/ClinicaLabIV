import { Component,OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { FirestoreService } from 'app/services/firestore.service';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { SwalService } from 'app/services/swal.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit{

  usuario: any = null;
  esPaciente: boolean = false;
  loading: boolean = false;

  especialistasList: any[] = [];
  pacientesList: any[] = [];
  nuevoArrayDeTurnos: any[] = [];
  activeEspecialista: any = null;
  activePaciente: any = null;
  speciality: any = null;
  specialistSelectionMenu: boolean = true;
  patientSelectionMenu: boolean = false;
  turnsSelectionMenu: boolean = false;
  arrayEspecialistas:any[] = []
  especialidadMenuSeleccion:boolean = true;
  listadoEspecialidades:any[] = []

  currentSpecialistTurnList: any[] = [];
  turnosAMostrar: any[] = [];
  turnosDeUnDiaAMostrar: any[] = [];
  diasAMostrar: any[] = [];
  botonPedirTurno: boolean = false;
  turnoSeleccionado: any = null;

  constructor(
    public authService:AuthService,
    private firestoreService:FirestoreService,
    private notificationService:NotificationService,
    private router:Router,
    private swal:SwalService
  ) 
  {}
  
  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe((user:any) => {
      if(user)
      {
        this.usuario = user;
        if(this.authService.esPaciente)
        {
          this.esPaciente = true
        }
        else if(this.authService.esAdmin)
        {
          this.patientSelectionMenu = true
        }

        this.firestoreService.TraerUsuarios().subscribe((users) => {
          if (users) {
            this.especialistasList = users.filter((u:any) => u.perfil == 'Especialista' && u.aprobado);
            this.pacientesList = users.filter((u:any) => u.perfil == 'Paciente');
            this.firestoreService.ObtenerListadoTurnos().subscribe((turnosEspecialista) => {
              this.currentSpecialistTurnList = turnosEspecialista;
              this.loading = false;
            });
            this.firestoreService.TraerEspecialidades().subscribe((esp) => {
              if(esp)
              {
                this.listadoEspecialidades = esp
              }
            });
          } else {
            this.loading = false;
          }
        });
      }
      this.loading = false;
    })
  }

  MostrarEspecialista(esp: any) {
    this.arrayEspecialistas = [];
    this.especialidadMenuSeleccion = false;
    this.speciality = esp;
    let especialistasListLength = this.especialistasList?.length ?? 0;
    for (let i = 0; i < especialistasListLength; i++) { 
      for (let j = 0; j < this.especialistasList[i].especialidad.length; j++) { //REVISAR
        if(this.speciality.nombre == this.especialistasList[i].especialidad[j].nombre)
        {
          this.arrayEspecialistas.push(this.especialistasList[i]);
        }
      }
    }
  }

  MostrarPaciente(paciente: any) {
    this.patientSelectionMenu = false;
    this.activePaciente = paciente;
    console.log(paciente);
  }

  VolverALasEspecialidades(){
    this.especialidadMenuSeleccion = true;
    this.patientSelectionMenu = false;
    this.speciality = null;
    this.turnsSelectionMenu = false;
  }

  showTurns(especialista: any) {
    this.turnsSelectionMenu = true;
    this.activeEspecialista = especialista;
    this.loadFreeHours('');
    this.turnosAMostrar.forEach((t) => {
      this.diasAMostrar.push(t.fecha);
    });

    const aux: any[] = [];
    let diasAMostrarLength = this.diasAMostrar?.length ?? 0;
    this.diasAMostrar.forEach((d) => {
      for (let i = 0; i < diasAMostrarLength; i++) {
        const fecha = this.diasAMostrar[i];
        if (d.getMonth() == fecha.getMonth() && d.getDate() == fecha.getDate()) {
          if (
            !aux.some((a) => {
              return d.getMonth() == a.getMonth() && d.getDate() == a.getDate();
            })
          ) {
            aux.push(d);
          }
        }
      }
    });

    aux.sort((a, b) => a - b);
    this.diasAMostrar = [...aux];
  }

  loadFreeHours(day: string) {
    const currentDate = new Date();
    const listaTurnosDelEspecialista = this.currentSpecialistTurnList.filter(
      (t) => t.especialista.email == this.activeEspecialista.email
    );
    const turnosEspecialidad =
      listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
        return (
          t.especialidad == this.speciality.nombre &&
          currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
        );
      });
      let turnosEspecialidadLength = turnosEspecialidad?.length ?? 0;
    const turnos15dias: any[] = [];
    for (let i = 0; i < turnosEspecialidadLength; i++) {
      const turno = { ...turnosEspecialidad[i] };
      if (
        new Date(turno.fecha.seconds * 1000).getTime() <=
        currentDate.getTime() + 84600000 * 15 &&
        turno.estado == 'disponible'
      ) {
        turno.fecha = new Date(turno.fecha.seconds * 1000);
        turnos15dias.push(turno);
      }
    }
    this.turnosAMostrar = [...turnos15dias];
  }

  SeleccionarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.botonPedirTurno = true;
    this.notificationService.showInfo('Se ha seleccionado un turno', 'Turnos');
  }

  SolicitarTurno() {
    if (this.esPaciente) {
      this.turnoSeleccionado.paciente = this.usuario;
      this.turnoSeleccionado.estado = 'solicitado';
    } else {
      this.turnoSeleccionado.paciente = this.activePaciente;
      this.turnoSeleccionado.estado = 'solicitado';
    }
    console.log('159');
    let currentSpecialistTurnListLength = this.currentSpecialistTurnList?.length ?? 0;
    let flagTurnoPedido:boolean = false;

    for (let i = 0; i < currentSpecialistTurnListLength; i++) {
      console.log('163');
      console.log(this.turnoSeleccionado);
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      if (turnosEspecialista.turnos != undefined) {
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          //new Date(t.fecha.seconds * 1000).getTime() ==
          this.turnoSeleccionado.fecha.getTime() &&
          t.especialidad == this.turnoSeleccionado.especialidad
        );
      });
      turnosEspecialista.turnos[index] = this.turnoSeleccionado;
      this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
      flagTurnoPedido = true;
    }
    }
    this.turnosAMostrar = [];
    this.turnosDeUnDiaAMostrar = [];
    this.botonPedirTurno = false;
    this.loading = true;

    if (flagTurnoPedido) {
      this.swal.MostrarExito(
        "EXITO",
        'Se solicitó el turno correctamente. '
      );
      setTimeout(() => {
        this.loading = false;
        this.notificationService.showSuccess('Se ha solicitado el turno exitosamente', 'Turnos');
        this.loadFreeHours('');
      }, 1000); //REVISAR
      this.router.navigate(['turnos/mis-turnos'])
    } else {
      this.swal.MostrarError(
        "ERROR",
        "Hubo un problema al solicitar el turno"
      );
    }
    }
  }
