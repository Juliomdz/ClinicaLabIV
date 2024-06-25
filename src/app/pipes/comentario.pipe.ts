import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comentario'
})
export class ComentarioPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let rta = value

    if(!value)
    {
      rta = "No hay reseña"
    }

    return rta;
  }

}