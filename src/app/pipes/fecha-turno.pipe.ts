import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaTurno'
})
export class FechaTurnoPipe implements PipeTransform {

  private meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  transform(value: any, ...args: unknown[]): unknown {

    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }

    let rtn = '';
    const dia = value.getDate().toString().padStart(2, '0');
    const mes = this.meses[value.getMonth()];
    rtn = `${dia} de ${mes}`; //sprint 2

    return rtn;
  }

}