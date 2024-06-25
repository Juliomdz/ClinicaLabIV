import { Directive, ElementRef,HostListener } from '@angular/core';

@Directive({
  selector: '[appBotonHover]'
})
export class BotonHoverDirective {

  constructor(private el:ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.style.borderRadius = '8px';
    this.el.nativeElement.style.border = 'none';
    this.el.nativeElement.style.height = '2.5rem'
    this.el.nativeElement.style.color = '#F1FAEE';
    this.el.nativeElement.style.backgroundColor = '#22b687';
    this.el.nativeElement.style.transition = 'all 0.3s ease 0s';
  }

  @HostListener('mouseenter')onMouseEnter()
  {
    this.el.nativeElement.style.backgroundColor = '#F18F01';
    this.el.nativeElement.style.boxShadow = '0px 15px 20px #f1910191';
    this.el.nativeElement.style.color = 'white';
    this.el.nativeElement.style.transform = 'translateY(-7px)';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '#22b687';
    this.el.nativeElement.style.boxShadow = '';
    this.el.nativeElement.style.color = '#F1FAEE';
    this.el.nativeElement.style.transform = '';
  }

}