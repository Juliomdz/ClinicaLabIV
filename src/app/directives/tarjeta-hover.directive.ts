import { Directive, ElementRef,HostListener } from '@angular/core';

@Directive({
  selector: '[appTarjetaHover]'
})
export class TarjetaHoverDirective {

  constructor(private el:ElementRef) { }

  @HostListener('mouseenter')onMouseEnter()
  {
    this.el.nativeElement.style.backgroundColor = '#F18F01';
    this.el.nativeElement.style.transition = 'background 0.5s'
    this.el.nativeElement.style.cursor = 'pointer'
  }

  @HostListener('mouseleave')
  onLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }

}