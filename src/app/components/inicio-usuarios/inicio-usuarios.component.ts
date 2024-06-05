import { Component,Output,EventEmitter,OnInit } from '@angular/core';
import { Usuario } from 'app/classes/usuario';
import { FirestoreService } from 'app/services/firestore.service';

@Component({
  selector: 'app-inicio-usuarios',
  templateUrl: './inicio-usuarios.component.html',
  styleUrls: ['./inicio-usuarios.component.scss']
})
export class InicioUsuariosComponent implements OnInit {

  @Output() usuarioClickeado = new EventEmitter<any>();
  listaUsuarios: any;

  constructor(private firestoreService:FirestoreService
    ) {}


  ngOnInit(): void {
    this.firestoreService.TraerUsuarios().subscribe((usuarios:any[]) => {
      const pacientes: any[] = [];
      const especialistas: any[] = [];
      const admins: any[] = [];

      usuarios.forEach((usuario) => {
        if (usuario.perfil === 'Paciente') {
          pacientes.push(usuario);
        } else if (usuario.perfil === 'Especialista') {
          especialistas.push(usuario);
        } else if (usuario.perfil === 'Administrador') {
          admins.push(usuario);
        }
      });

      this.listaUsuarios = {
        pacientes: pacientes.splice(0,3),
        especialistas: especialistas.splice(0,2),
        admins: admins.splice(0,1),
      }
      console.info(this.listaUsuarios)
    })
  }

  clickListado(usuario: any) {
    this.usuarioClickeado.emit(usuario);
  }
}
