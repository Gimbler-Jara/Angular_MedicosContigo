import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../DTO/Login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService)
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
          this.authService.setUsuario(usuario);
          console.log(usuario);


          if (usuario.rol.id == 1) {
            this.router.navigate(['/perfil']);
          } else if (usuario.rol.id == 2) {
            this.router.navigate(['/perfil-medico']);
          } else {
            console.log("Adminstrador");
          }

        }
      });


      // Aquí puedes enviar los datos al backend
      this.formularioLogin.reset();
    }
  }
}
