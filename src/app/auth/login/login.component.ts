import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../DTO/Login.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService)
  localStorageService = inject(LocalStorageService);
  router = inject(Router)
  formularioLogin: FormGroup;
  showPassword: boolean = false;

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
    if (this.formularioLogin.valid) {
      var user: LoginDTO = {
        email: this.formularioLogin.value.email,
        password: this.formularioLogin.value.password
      }
      console.log('Datos enviados:', user);
      this.authService.login(user).then(usuario => {
        if (usuario) {
          this.localStorageService.setUsuario(usuario);

          if (usuario.rol.id == 1) {
            this.router.navigate(['/perfil']);
          } else if (usuario.rol.id == 2) {
            this.router.navigate(['/perfil-medico']);
          } else {
            this.router.navigate(['/admin']);
          }
          this.formularioLogin.reset();
          this.showAlert('success', 'Inicio de sesión exitoso');
        }
      }).catch(error => {
        console.error('Error al iniciar sesión:', error)
        this.showAlert('error', error?.error?.message || 'Error al iniciar sesión');
      });
      
    }
  }

  showAlert(icon:'warning'| 'error'| 'success',message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: message
    });
  }
}
