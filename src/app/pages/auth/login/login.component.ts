import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'app/classes/usuario';
import { AuthService } from 'app/services/auth.service';
import { FirestoreService } from 'app/services/firestore.service';
import { SwalService } from 'app/services/swal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loading:boolean = false
  //@ts-ignore
  formUsuario: FormGroup;

  constructor(private fb: FormBuilder,private swal:SwalService,private authService:AuthService,private firestoreService:FirestoreService,private router:Router) { }

  ngOnInit(): void {
    this.loading = true
    this.formUsuario = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      clave: ['',[Validators.required,Validators.minLength(6)]]
    });

    setTimeout(() => {
      this.loading = false
    }, 1600);
  }

  async Login()
  {
    if(this.formUsuario.valid)
    {
      this.loading = true;
      const email = this.formUsuario.getRawValue().email;
      const clave = this.formUsuario.getRawValue().clave;

      this.authService.Login(email,clave).then((data:any) => {
        if (!data.user.emailVerified) {
          this.swal.MostrarAdvertencia("ADVERTENCIA","¡Debe verificar su correo electrónico antes de poder ingresar!");
          this.authService.Logout();
          this.authService.seLogueo = false;
          this.loading = false;
        }
        else
        {
          this.firestoreService.TraerUsuarioPorEmail(email).then((querySnapshot) => {
            const usuarioLogueado = querySnapshot.docs[0].data() as Usuario;
            switch (usuarioLogueado.perfil) {
              case "Paciente":
                this.swal.MostrarExito("¡Ingreso Exitoso!","¡Sera redirigido al inicio!").then(() => {
                  usuarioLogueado.aprobado = true;
                  this.authService.ActualizarUsuario(usuarioLogueado);
                  this.authService.seLogueo = true;
                  this.router.navigate(['']);
                  this.loading = false;
                });
                break;
              case "Especialista":
                if(usuarioLogueado.aprobado)
                {
                  this.swal.MostrarExito("¡Ingreso Exitoso!","¡Sera redirigido al inicio!").then(() => {
                    usuarioLogueado.aprobado = true;
                    this.authService.ActualizarUsuario(usuarioLogueado);
                    this.authService.seLogueo = true;
                    this.router.navigate(['']);
                  });
                }
                else
                {
                  this.swal.MostrarAdvertencia("ATENCION","Su cuenta esta pendiente de aprobacion por un Administrador")
                  this.authService.Logout();
                  this.authService.seLogueo = false;
                }
                this.loading = false;
                break;
              default:
                this.swal.MostrarExito("¡Ingreso Exitoso!","¡Sera redirigido al inicio!").then(() => {
                  this.authService.seLogueo = true;
                  this.router.navigate(['']);
                  this.loading = false;
                });
                break;
            }
          })
        }
      }).catch((error) => {
        this.swal.MostrarError("ERROR",this.authService.ObtenerMensajeError(error.code))
        this.loading = false;
      })
    }
    else
    {
      this.swal.MostrarError("ERROR","¡Asegurese de completar los campos correctamente!")
      this.loading = false;
    }
  }

  ReciboUnUsuario($event:any)
  {
    console.info($event)
    this.formUsuario.patchValue({
      email: $event.email,
      clave:$event.password
    })
  }
}
