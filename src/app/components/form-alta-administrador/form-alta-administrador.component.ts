import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Usuario } from 'app/classes/usuario';
import { AuthService } from 'app/services/auth.service';
import { StorageService } from 'app/services/storage.service';
import { SwalService } from 'app/services/swal.service';

@Component({
  selector: 'app-form-alta-administrador',
  templateUrl: './form-alta-administrador.component.html',
  styleUrls: ['./form-alta-administrador.component.scss']
})
export class FormAltaAdministradorComponent {
  //@ts-ignore
  formAdministrador: FormGroup;
  textoEspecialidades: string = "";
  imagenes:any[]
  nuevoAdministrador = new Usuario()
  loading = false
  captcha:string = ''

  constructor(private fb: FormBuilder,private swal:SwalService,private storageService:StorageService,private authService:AuthService) { 
    this.imagenes = [];
  }

  ngOnInit() {
    this.formAdministrador = this.fb.group({
      nombre: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      apellido: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      edad: ['',[Validators.required]],
      dni: ['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      email: ['',[Validators.required,Validators.email]],
      clave: ['',[Validators.required,Validators.minLength(6)]],
      foto:['',Validators.required],
      captcha:['',Validators.required]
    });

    this.captcha = this.GenerarCaptcha(6)
  }

  async Registrar() {
    if(this.formAdministrador.valid && this.imagenes.length == 1)
    {
      if(this.captcha.toLocaleLowerCase().trim() == this.formAdministrador.getRawValue().captcha.toLocaleLowerCase().trim())
      {
        this.loading = true

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const files: FileList | null = fileInput.files;
  
        const urls = await this.storageService.SubirImagenes(this.formAdministrador.getRawValue().dni,files,"administradores")
  
        this.nuevoAdministrador.nombre = this.formAdministrador.getRawValue().nombre;
        this.nuevoAdministrador.apellido = this.formAdministrador.getRawValue().apellido;
        this.nuevoAdministrador.edad = this.formAdministrador.getRawValue().edad;
        this.nuevoAdministrador.dni = this.formAdministrador.getRawValue().dni;
        this.nuevoAdministrador.email = this.formAdministrador.getRawValue().email;
        this.nuevoAdministrador.password = this.formAdministrador.getRawValue().clave;
        this.nuevoAdministrador.perfil = "Administrador"
        this.nuevoAdministrador.fotos = urls
        this.authService.registerUsuario(this.nuevoAdministrador)
        setTimeout(() => {
          this.loading = false;
          this.formAdministrador.reset();
          this.nuevoAdministrador = new Usuario();
        }, 2000);
      }
      else
      {
        this.swal.MostrarError('ERROR','¡El captcha es incorrecto!');
      }
    }
    else {
      this.swal.MostrarError('ERROR','¡Asegurese de completar el formulario correctamente!');
    }
    this.loading = false
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 1) {
      this.swal.MostrarError("ERROR","Debe subir 1 imágen")
      return;
    }

    this.imagenes = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.imagenes.push(imageUrl);
    }
  }

  GenerarCaptcha(num:number) :string
  {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaRetorno = ' ';
    const cantCaracteres = caracteres.length;
    for (let i = 0; i < num; i++) {
      captchaRetorno += caracteres.charAt(
        Math.floor(Math.random() * cantCaracteres)
      );
    }
    return captchaRetorno;
  }
}
