import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../services/swal.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(AuthService);
  const router = inject(Router);
  const swal = inject(SwalService)
  const { user$ } = userService;

  return user$.pipe(
    take(1), 
    map((user) => {
      // @ts-ignore
      if (user && user.perfil === "Administrador") {
        return true; 
      } else {
        swal.MostrarError("ERROR","¡Solo el Administrador puede ingresar!")
        router.navigateByUrl('')
        return false; 
      }
    })
  );
};