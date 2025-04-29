import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  isAutentiticared: boolean = false;
  private usuarioSubscription!: Subscription;

  rol: number = 0;

  localStorageService = inject(LocalStorageService);

  constructor(private router: Router, private authService: AuthService) {
  }

  navegarAEspecialidades() {
    this.router.navigate(['/especialidades'])
  }

  ngOnInit(): void {
    this.usuarioSubscription = this.localStorageService.usuario$.subscribe(usuario => {
      this.isAutentiticared = !!usuario;
      this.rol = usuario?.rol.id!;
    });
  }

  ngOnDestroy(): void {
    // Evita memory leaks
    this.usuarioSubscription.unsubscribe();
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.localStorageService.setUsuario(null);
    });
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }


}
