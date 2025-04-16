import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnDestroy {
  @Input('appCountUp') endValue: number = 0;

  @Input() prefix: string = ''; // Ej: '+'
  @Input() suffix: string = ''; // Ej: '%'

  private observer?: IntersectionObserver;
  private started = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.started) {
          this.started = true;
          this.animateCountUp(this.endValue);
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  animateCountUp(end: number) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      this.el.nativeElement.textContent = `${this.prefix}${value.toLocaleString()}${this.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
