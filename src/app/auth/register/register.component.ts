import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgModel, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioRequest } from '../../interface/Usuario/Usuario.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  usuarioService = inject(AuthService)

  formularioUsuario: FormGroup;
  showPassword: boolean = false;
  showConfirm: boolean = false;



  tiposDocumento = [
    { value: 1, label: 'DNI' },
    { value: 2, label: 'Carnet de Extranjería' },
    { value: 3, label: 'Pasaporte' }
  ];

  private formularioInicial = {
    document_type: "",
    dni: '',
    last_name: '',
    middle_name: '',
    first_name: '',
    birth_date: '',
    gender: 'M',
    telefono: '',
    email: '',
    password_hash: '',
    // confirmPassword: '',
    rol_id: 1
  };

  constructor(private fb: FormBuilder) {
    this.formularioUsuario = this.fb.group({
      document_type: ['', Validators.required],
      dni: ['', Validators.required],
      last_name: ['', Validators.required],
      middle_name: [''],
      first_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['M', Validators.required],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],
      password_hash: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rol: [1]
    },
      {
        validators: [this.passwordsMatchValidator]
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm(): void {
    this.showConfirm = !this.showConfirm;
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password_hash')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNoMatch: true };
  }


  registrarUsuario() {
    if (this.formularioUsuario.valid) {
      var usuario: UsuarioRequest = {
        document_type: Number(this.formularioUsuario.value.document_type),
        dni: this.formularioUsuario.value.dni,
        lastName: this.formularioUsuario.value.last_name,
        middleName: this.formularioUsuario.value.middle_name,
        firstName: this.formularioUsuario.value.first_name,
        birthDate: this.formularioUsuario.value.birth_date,
        gender: this.formularioUsuario.value.gender,
        telefono: this.formularioUsuario.value.telefono,
        email: this.formularioUsuario.value.email,
        passwordHash: this.formularioUsuario.value.password_hash,
        rol_id: Number(this.formularioUsuario.value.rol)
      }
      console.log(usuario);
      this.usuarioService.agregarUsuario(usuario)
      this.formularioUsuario.reset(this.formularioInicial);
    }
  }
}
