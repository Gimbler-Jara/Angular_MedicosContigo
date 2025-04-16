import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'show');
        } else {
          this.renderer.removeClass(this.el.nativeElement, 'show');
        }
      });
    }, {
      threshold: 0.01
    });

    observer.observe(this.el.nativeElement);
  }

}
