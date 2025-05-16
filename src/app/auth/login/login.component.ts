import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../DTO/Login.interface';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../pages/loading/loading.component';

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
    if (this.formularioLogin.valid) {
      this.isLoading = true;
      var user: LoginDTO = {
        email: this.formularioLogin.value.email,
        password: this.formularioLogin.value.password
      }
      console.log('Datos enviados:', user);
      this.authService.login(user).then(usuario => {
        if (usuario) {
          console.log(usuario);
          
          if (usuario.rol?.id === 1) {
            this.router.navigate(['/perfil']);
          } else if (usuario.rol?.id === 2) {
            this.router.navigate(['/perfil-medico']);
          } else if (usuario.rol?.id === 3) {
            this.router.navigate(['/admin']);
          } else {
            this.showAlert('error', 'Rol de usuario no reconocido');
          }

          this.formularioLogin.reset();
          this.isLoading = false;
          this.showAlert('success', 'Inicio de sesión exitoso');
        }
      }).catch(error => {
        console.error('Error al iniciar sesión:', error)
        console.log(error?.error?.message);
        this.isLoading = false;
        this.showAlert('error', error?.error?.message || 'Error al iniciar sesión');
      });
    }
  }

  showAlert(icon: 'warning' | 'error' | 'success', message: string) {
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
