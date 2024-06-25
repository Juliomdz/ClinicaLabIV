import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'app/services/firestore.service';
import { SwalService } from 'app/services/swal.service';

@Component({
  selector: 'app-lista-especialidades',
  templateUrl: './lista-especialidades.component.html',
  styleUrls: ['./lista-especialidades.component.scss']
})
export class ListaEspecialidadesComponent {
  
  @Output() botonClickeado = new EventEmitter<any>();
  especialidades: string[] = [];
  listaFiltrada: string[] = [];
  valorInput: string;
  nuevaEspecialidad: string;
  inputValidado: boolean = false;
  arrayEspecialidades: any[] = [];

  constructor(public firestoreService: FirestoreService, private swal: SwalService) {
    this.nuevaEspecialidad = "";
    this.valorInput = "";
  }

  ngOnInit(): void {
    this.listaFiltrada = [];
    this.firestoreService.TraerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.listaFiltrada = [...this.especialidades];
    });
  }

  validarEspecialidad() {
    if (this.valorInput.match(/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/)) {
      this.inputValidado = true;
      this.nuevaEspecialidad = this.valorInput;
    } else {
      this.inputValidado = false;
    }
    this.valorInput = '';
    this.listaFiltrada = [...this.especialidades];
  }

  filtrarLista() {
    this.listaFiltrada = this.especialidades.filter((item: string) =>
      item.toLowerCase().startsWith(this.valorInput.toLowerCase())
    );
  }

  agregarItem() {
    if (this.inputValidado) {
      this.firestoreService.GuardarEspecialidad(this.nuevaEspecialidad);
      this.swal.MostrarExito(
        "EXITO",
        'Se agrego la especialidad ' + this.nuevaEspecialidad
      );
    } else {
      this.swal.MostrarError(
        "ERROR",
        "Debe de agregar una especialidad válida"
      );
    }
  }

  clickListado(especialidad: any) {
    const especialidadConNombre = { nombre: especialidad };

    if (!this.arrayEspecialidades.some((e) => e.nombre === especialidad)) {
      if (this.arrayEspecialidades?.length < 2) {
        this.arrayEspecialidades.push(especialidadConNombre);
        this.botonClickeado.emit(this.arrayEspecialidades);
      }
    } else {
      const indice = this.arrayEspecialidades?.findIndex((e) => e.nombre === especialidad);
      this.arrayEspecialidades.splice(indice, 1);
      this.botonClickeado.emit(this.arrayEspecialidades);
    }
  }
}
