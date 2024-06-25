import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { SwalService } from '../services/swal.service';
import { AuthService } from '../services/auth.service';


export const seLogueoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const swal = inject(SwalService)
  const { seLogueo } = authService;

  if(seLogueo)
  {
    return true
  }

  swal.MostrarError("ERROR","¡No puede ingresar sin estar logueado!")
  router.navigateByUrl('/');
  return false;
};