import { Directive, ElementRef,HostListener } from '@angular/core';

@Directive({
  selector: '[appInputBusqueda]'
})
export class InputBusquedaDirective {

  constructor(private element:ElementRef) { }

  ngOnInit() {
    this.element.nativeElement.style.backgroundColor = '#F18F01';
    this.element.nativeElement.style.border = 'none';
    this.element.nativeElement.style.padding = '0.5rem';
    this.element.nativeElement.style.fontSize = '1rem';
    this.element.nativeElement.style.width = '13em';
    this.element.nativeElement.style.borderRadius = '1rem';
    this.element.nativeElement.style.color = '#F1FAEE';
    this.element.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('focus') onFocus() {
  this.element.nativeElement.style.outlineColor  = '#F1FAEE';
  }
}