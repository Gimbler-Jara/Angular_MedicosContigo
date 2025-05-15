import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular_MedicosContigo';

  authService = inject(AuthService)
  localStorageService = inject(LocalStorageService)
  router = inject(Router)

  ngOnInit(): void {
    setInterval(() => {
      const tiempoRestante = this.authService.getTiempoRestante();
      // console.log(`⏳ Tiempo restante: ${tiempoRestante} seg`);


      if (tiempoRestante <= 0) {
        // console.warn('⛔ Token vencido, cerrando sesión...');
        // localStorage.removeItem('token');
        // this.router.navigate(['/login']);
        return;
      }

      if (tiempoRestante < 90) {
        console.log('🕐 Token está por expirar, solicitando renovación...');
        this.authService.renovarToken().subscribe({
          next: nuevoToken => {
            localStorage.setItem('token', nuevoToken);
          },
          error: err => {
            console.error('⚠️ Error al renovar token', err);
            // localStorage.removeItem('token');
            // this.router.navigate(['/login']);
          }
        });
      }
    }, 10 * 1000);
  }

}
