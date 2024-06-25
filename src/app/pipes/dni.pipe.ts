import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dni'
})
export class DniPipe implements PipeTransform {

  transform(dni: number, ...args: unknown[]): unknown {

    if (!isNaN(dni) && dni.toString().length === 8) {
      const dniString = dni.toString();
      const firstPart = dniString.slice(0, 2);
      const secondPart = dniString.slice(2, 5);
      const thirdPart = dniString.slice(5, 8);

      return `${firstPart}.${secondPart}.${thirdPart}`;
    } else {
      return dni.toString();
    }
  }

}