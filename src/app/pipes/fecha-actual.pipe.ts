import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaActual'
})
export class FechaActualPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {

    let anio = value.getFullYear();
    let mes = (value.getMonth() + 1).toString().padStart(2, '0');
    let dia = value.getDate().toString().padStart(2, '0');
    let hora = value.getHours().toString().padStart(2, '0');
    let minuitos = value.getMinutes().toString().padStart(2, '0');

    let rtn = `${anio}/${mes}/${dia} ${hora}:${minuitos}`;
    return rtn;
  }

}