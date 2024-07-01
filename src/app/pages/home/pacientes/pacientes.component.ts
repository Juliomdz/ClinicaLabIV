import { Component,OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'app/services/firestore.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit{
  loading:boolean = false;
  usuario: any = null;
  listadoUsuarios: any[] = [];
  turnosDelPaciente: any;
  turnosDelEspecialista: any;
  currentSpecialistTurnList: any;
  pacientesAtendidos: any[] = [];
  turnosFiltrados: any;
  turnList: any;
  pacientesDelEspecialista: any;
  auxPacientesDelEspecialista: any;
  listaDeEspecialistas: any;

  historialesClinicos: any[] = [];
  historialActivo: any[] = [];
  historialClinicoDelEspecialista: any[] = [];
  hayPacientesAtendidos: boolean = false;
  turnosActivos: any[] = [];

  constructor(
    private authService:AuthService,
    private firestoreService: FirestoreService,
  ) 
  {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.usuario = user;
      }
      this.firestoreService.TraerUsuarios().subscribe((users) => {
        if (users) {
          this.listadoUsuarios = users;
        }
        this.firestoreService.ObtenerHistorialesClinicos().subscribe((historiales) => {
          this.historialesClinicos = historiales;
          this.pacientesAtendidos = [];
          this.historialClinicoDelEspecialista = [];
          historiales.forEach((h) => {
            let listadoUsuariosLength = this.listadoUsuarios?.length ?? 0;
            for (let i = 0; i < listadoUsuariosLength; i++) {
              const usuario = this.listadoUsuarios[i];
              if (usuario.perfil == 'Paciente' && usuario.id == h.paciente.id && this.usuario.id == h.especialista.id
              ) {
                this.listadoUsuarios[i].historial = true;
                this.pacientesAtendidos = this.pacientesAtendidos.filter(
                  (p) => {
                    return p.id != usuario.id;
                  }
                );
                this.pacientesAtendidos.push(usuario);
              }
            }
          });

          this.historialClinicoDelEspecialista = this.historialesClinicos.filter(
            (h) => {
              return h.especialista.id == this.usuario.id;
            }
          );

          this.historialClinicoDelEspecialista.forEach((h) => {
            h.paciente.contadorHistorial = 0;
          });
          let pacientesAtendidosLength = this.pacientesAtendidos?.length ?? 0;
          for (let i = 0; i < pacientesAtendidosLength; i++) {
            const paciente = this.pacientesAtendidos[i];
            paciente.contador = 0;
            this.historialClinicoDelEspecialista.forEach((h) => {
              if (paciente.id == h.paciente.id) {
                paciente.contador++;
                h.paciente.contador = paciente.contador;
              }
            });
          }

          if (pacientesAtendidosLength == 0) {
            this.hayPacientesAtendidos = false;
          } else {
            this.hayPacientesAtendidos = true;
          }
          this.CargarTurnos();
        });
      });
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    });
  }


  VerHistorialPaciente(paciente: any) {
    this.loading = true;
    this.historialActivo = [];
    this.turnosActivos = [];
    let historialesClinicosLength = this.historialesClinicos?.length ?? 0;
    for (let i = 0; i < historialesClinicosLength; i++) {
      const historial = this.historialesClinicos[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
    let turnosFiltradosLength = this.turnosFiltrados?.length ?? 0;
    for (let i = 0; i < turnosFiltradosLength; i++) {
      const turnoFiltrado = this.turnosFiltrados[i];
      if (turnoFiltrado.paciente.id == paciente.id) {
        this.turnosActivos.push(turnoFiltrado);
      }
    }
    this.loading = false;
  }

  CargarTurnos() {
    this.firestoreService.ObtenerListadoTurnos().subscribe((turns: any) => {
      this.currentSpecialistTurnList = turns;
      this.turnList = [];
      this.turnosFiltrados = [];
      this.turnosDelPaciente = [];
      this.turnosDelEspecialista = [];
      this.pacientesDelEspecialista = [];
      this.auxPacientesDelEspecialista = [];

      let turnsLength = turns?.length ?? 0;
      for (let i = 0; i < turnsLength; i++) {
        const turnSpecialist = turns[i].turnos;
        let turnSpecialistLength = turnSpecialist?.length ?? 0;
        for (let j = 0; j < turnSpecialistLength; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado !== 'disponible') {
            this.turnList.push(turn);
            if (turn.paciente?.id === this.usuario?.id) {
              this.turnosDelPaciente.push(turn);
            }
            if (turn.especialista?.id === this.usuario?.id) {
              this.turnosDelEspecialista.push(turn);
              this.auxPacientesDelEspecialista.push(turn.paciente);
            }
          }
        }
      }
      let auxPacientesDelEspecialistaLength = this.auxPacientesDelEspecialista?.length ?? 0;
      for (let i = 0; i < auxPacientesDelEspecialistaLength; i++) {
        const paciente = this.auxPacientesDelEspecialista[i];
        const index = this.pacientesDelEspecialista.findIndex((p: any) => paciente.id === p.id);
        if (index === -1) {
          this.pacientesDelEspecialista.push(paciente);
        }
      }

      this.turnosFiltrados = [...this.turnosDelEspecialista];

    });
  }
}