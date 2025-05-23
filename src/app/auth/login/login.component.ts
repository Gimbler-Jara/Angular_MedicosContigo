import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../DTO/Login.interface.DTO';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../pages/loading/loading.component';
import { showAlert } from '../../utils/utilities';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router)
  formularioLogin: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  iniciarSesion(): void {
    if (!this.formularioLogin.valid) return;

    this.isLoading = true;

    const { email, password } = this.formularioLogin.value;
    const credentials: LoginDTO = { email, password };

    // console.log('Datos enviados:', credentials);

    this.authService.login(credentials)
      .then(data => {       
        if (!data.usuario || !data.usuario.rol?.id) {
          showAlert('error', 'No se pudo determinar el rol del usuario');
          return;
        }

        const ruta = this.obtenerRutaPorRol(data.usuario.rol.id);
        if (ruta) {
          this.router.navigate([ruta]);
          showAlert('success', data.mensaje);
        } else {
          showAlert('error', 'Rol de usuario no reconocido');
        }

        this.formularioLogin.reset();
      })
      .catch(error => {
        // console.error('Error al iniciar sesión:', error);
        // console.log(error.error.httpStatus);
        // console.log(error.error.mensaje);
        showAlert('error', error.error.mensaje);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }


  private obtenerRutaPorRol(rolId: number): string | null {
    switch (rolId) {
      case 1: return '/perfil';
      case 2: return '/perfil-medico';
      case 3: return '/admin';
      default: return null;
    }
  }

}
