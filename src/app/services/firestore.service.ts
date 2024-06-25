import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore:AngularFirestore) { }

  TraerEspecialidades()
  {
    return this.angularFirestore.collection('especialidades').valueChanges()
  }

  GuardarEspecialidad(especialidades:any)
  {
    const documento = this.angularFirestore.doc('especialidades/' + this.angularFirestore.createId());
    const uid = documento.ref.id;

    documento.set({
      uid: uid,
      nombre: especialidades
    });
  }

  TraerUsuarioPorEmail(email:string) {
    const collectionUsers = this.angularFirestore.collection('usuarios')

    return collectionUsers.ref.where('email','==',email).limit(1).get();
  }

  TraerUsuarios()
  {
    const collectionUser = this.angularFirestore.collection('usuarios')

    return collectionUser.valueChanges()
  }

  CrearListadoTurnos(turno: any) {
    this.angularFirestore
      .collection<any>('turnos')
      .add(turno)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turno.especialista,
          turnos: turno.turnos,
        });
      });
  }

  ActualizarListadoTurnos(turno: any) {
    this.angularFirestore
      .doc<any>(`turnos/${turno.id}`)
      .update(turno)
      .then(() => { })
  }

  ObtenerListadoTurnos() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  }

  CrearHistorialClinico(turno:any)
  {
    return this.angularFirestore.collection<any>('historialesClinicos')
      .add(turno)
      .then((data) => {
        this.angularFirestore
          .collection('historialesClinicos')
          .doc(data.id)
          .set({
            id: data.id,
            especialidad: turno.especialidad,
            especialista: turno.especialista,
            paciente: turno.paciente,
            fecha: turno.fecha,
            detalle: turno.detalle,
            detalleAdicional: turno.detalleAdicional,
          });
      })
      .catch((error) => {
        throw error;
      });
  }

  ObtenerHistorialesClinicos()
  {
    const collection = this.angularFirestore.collection<any>('historialesClinicos');
    return collection.valueChanges();
  }
}
