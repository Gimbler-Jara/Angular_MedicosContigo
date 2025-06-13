import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { UsuarioStorage } from './DTO/UsuarioStorage.DTO';
import { obtenerDatosUsuario } from './utils/utilities';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular_MedicosContigo';

  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token && !sessionStorage.getItem('usuario')) {
      this.authService.obtenerPerfilDesdeToken(token).subscribe((res) => {
        if (res.usuario) {
          var u = obtenerDatosUsuario(res.usuario);
          this.localStorageService.setUsuario(u);
        }
      });
    }

    // this.intervalId = setInterval(() => {
    //   const tiempoRestante = this.authService.getTiempoRestante();
    //   if (tiempoRestante <= 0) {
    //     console.warn('🔴 Token vencido, cerrando sesión...');
    //     localStorage.removeItem('token');
    //     this.router.navigate(['/login']);
    //   }
    // }, 10 * 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
