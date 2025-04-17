import { CommonModule, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgModel, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formularioUsuario: FormGroup;
  showPassword: boolean = false;
  showConfirm: boolean = false;



  tiposDocumento = [
    { value: 1, label: 'DNI' },
    { value: 2, label: 'Carnet de Extranjería' },
    { value: 3, label: 'Pasaporte' }
  ];

  private formularioInicial = {
    document_type: '',
    dni: '',
    last_name: '',
    middle_name: '',
    first_name: '',
    birth_date: '',
    gender: '',
    telefono: '',
    email: '',
    password_hash: '',
    confirmPassword: '',
    rol: 'paciente'
  };

  constructor(private fb: FormBuilder) {
    this.formularioUsuario = this.fb.group({
      document_type: ['', Validators.required],
      dni: ['', Validators.required],
      last_name: ['', Validators.required],
      middle_name: [''],
      first_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],
      password_hash: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rol: ['paciente']
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
      console.log(this.formularioUsuario.value);
      this.formularioUsuario.reset(this.formularioInicial);
    }
  }
}
