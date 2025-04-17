import { Component, Renderer2 } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScrollRevealDirective, CountUpDirective, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  mostrarPopup = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    // const yaVisto = sessionStorage.getItem('popupVisto');
    // if (!yaVisto) {
    setTimeout(() => {
      this.mostrarPopup = true;
      // sessionStorage.setItem('popupVisto', 'true');
      this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    }, 2000);
    // }
  }

  cerrarPopup(): void {
    this.mostrarPopup = false;
    this.renderer.removeStyle(document.documentElement, 'overflow');
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.documentElement, 'overflow');
  }
}
