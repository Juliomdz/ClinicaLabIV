import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../classes/usuario';
import { SwalService } from './swal.service';
import { Router } from '@angular/router';
import { switchMap,of } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: any;
  esAdmin: boolean = false;
  esPaciente:boolean = false;
  esEspecialista:boolean = false;
  seLogueo: boolean = false;
  usuarioLogueado: any;

  constructor(
    private angularFirestore: AngularFirestore,
    private swal: SwalService,
    private afAuth: AngularFireAuth) 
    {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user: any) => {
          if (user) {
            this.seLogueo = true;
            return this.angularFirestore.doc<Usuario>(`usuarios/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
    }

    async Login(email: string, password: string) {
      return this.afAuth.signInWithEmailAndPassword(email,password)
    }

    registerUsuario(nuevoUsuario: Usuario) {
      var config = {
      apiKey: "AIzaSyC2PMDfyoSAB2nQdjEmilWDFt2tw7-CHDQ",
      authDomain: "juliomendezlabivclinica.firebaseapp.com",
      projectId: "juliomendezlabivclinica",
      storageBucket: "juliomendezlabivclinica.appspot.com",
      messagingSenderId: "244440660650",
      appId: "1:244440660650:web:6bc6007d39badb15d12ed3"
      };
      const secondaryApp = firebase.initializeApp(config, "Secondary");
      secondaryApp.auth().createUserWithEmailAndPassword(nuevoUsuario.email, nuevoUsuario.password)
        .then((data: any) => {
          const uid = data.user?.uid;
          const documento = this.angularFirestore.doc('usuarios/' + uid);
          documento.set({
            id: uid,
            perfil: nuevoUsuario.perfil,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            edad: nuevoUsuario.edad,
            dni: nuevoUsuario.dni,
            obraSocial: nuevoUsuario.obraSocial,
            especialidad: nuevoUsuario.especialidad,
            email: nuevoUsuario.email,
            password: nuevoUsuario.password,
            fotos:nuevoUsuario.fotos,
            aprobado: nuevoUsuario.aprobado,
          })
            .then(() => {
              data.user.sendEmailVerification();
              this.swal.MostrarExito("¡Registro exitoso!","Por favor, verifique su correo electrónico para activar su cuenta");
            })
            .catch((error) => {
              this.swal.MostrarError("ERROR",this.ObtenerMensajeError(error.code));
            })
            .finally(() => {
              secondaryApp.auth().signOut();
              secondaryApp.delete();
            });
        })
        .catch((error: any) => {
          this.swal.MostrarError("ERROR",this.ObtenerMensajeError(error.code));
        });
    }

    Logout() {
      this.afAuth.signOut().then(() =>{
        this.seLogueo = false;
        this.esAdmin = false;
        this.esEspecialista = false;
        this.esPaciente = false;
      }).catch((error) => {
        this.swal.MostrarError("¡ERROR!",this.ObtenerMensajeError(error.errorCode))
        console.log(error)
      })
    }

    ActualizarUsuario(usuario: any) {
      this.angularFirestore
        .doc<any>(`usuarios/${usuario.id}`)
        .update(usuario)
        .then(() => { })
    }

    ObtenerMensajeError(errorCode: string): string {

      let mensaje: string = '';
  
      switch (errorCode) {
        case 'auth/operation-not-allowed':
          mensaje = 'La operación no está permitida.';
          break;
        case 'auth/email-already-in-use':
          mensaje = 'El email ya está registrado.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El email no es valido.';
          break;
        case 'auth/wrong-password':
          mensaje = 'La contraseña es inválida';
          break;
        case 'auth/invalid-login-credentials':
          mensaje = "No se encontro el usuario"
          break;
        default:
          mensaje = 'Se produjo un error';
          break;
      }
      return mensaje;
    } 

    ObtenerAuthState()
    {
      return this.afAuth.authState
    }
}
