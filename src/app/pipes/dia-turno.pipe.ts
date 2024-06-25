import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diaTurno'
})
export class DiaTurnoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let anio = value.getFullYear();
    let mes = (value.getMonth() + 1).toString().padStart(2, '0');
    let dia = value.getDate().toString().padStart(2, '0');
    let hora = value.getHours().toString().padStart(2, '0');
    let minutos = value.getMinutes().toString().padStart(2, '0');
    let segundos = value.getSeconds().toString().padStart(2, '0');
    let rtn = `${dia}-${mes}-${anio} ${hora}:${minutos}:${segundos}`;

    return rtn;
  }

}