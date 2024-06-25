import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horarioTurno'
})
export class HorarioTurnoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {

    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }

    let rtn = ''
    const dia = value.getDate().toString().padStart(2, '0');
    const mes = (value.getMonth() + 1).toString().padStart(2, '0');
    const hora = value.getHours() + 2
    const minutos = value.getMinutes().toString().padStart(2, '0');

    rtn =`${mes}/${dia} ${hora}:${minutos}`

    return rtn;
  }

}