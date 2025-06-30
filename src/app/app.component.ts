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
  token = this.localStorageService.getToken();
  usuario = sessionStorage.getItem('usuario');

  ngOnInit(): void {
    if (this.token && !this.usuario) {
      this.authService.obtenerPerfilDesdeToken().subscribe((res) => {
        if (res.usuario) {
          var u = obtenerDatosUsuario(res.usuario);
          this.localStorageService.setUsuario(u);
          location.reload();
        }
      });
    }

    this.monitorToken();
  }

  monitorToken() {
    if (!this.token || !this.usuario) {
      console.log('🔒 Usuario no autenticado.');
      return;
    }

    const tiempoRestante = this.authService.getTiempoRestante();

    if (tiempoRestante > 0) {
      console.log(`⏱ Token expira en ${tiempoRestante} segundos`);
      setTimeout(() => {
        this.localStorageService.logOut();
        console.warn('🔐 Token expirado. Redirigiendo al login...');
      }, tiempoRestante * 1000);
    } else {
      this.localStorageService.logOut();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
