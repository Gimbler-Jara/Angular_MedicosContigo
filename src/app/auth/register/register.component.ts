import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgModel, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioPacienteRequest } from '../../interface/Usuario/Usuario.interface';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { EmailService } from '../../services/email.service';
import { getRegisterTemplateHTML } from '../../utils/template';
import Swal from 'sweetalert2';
import { Document_Type } from '../../interface/DocumentType.interface';
import { DocumentTypeService } from '../../services/document-type.service';
import { LoadingComponent } from '../../pages/loading/loading.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private usuarioSubscription!: Subscription;
  usuarioService = inject(AuthService)
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  emailService = inject(EmailService);
  router = inject(Router);
  typeDocumentService = inject(DocumentTypeService);

  formularioUsuario: FormGroup;
  showPassword: boolean = false;
  showConfirm: boolean = false;
  isLoading: boolean = false;
  rol: number = 0

  tiposDocumento: Document_Type[] = [];

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
    // confirmPassword: ''
  };

  constructor(private fb: FormBuilder) {
    this.formularioUsuario = this.fb.group({
      document_type: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      middle_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password_hash: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [this.passwordsMatchValidator]
    });
  }

  ngOnInit(): void {
    this.usuarioSubscription = this.localStorageService.usuario$.subscribe(usuario => {
      this.rol = usuario?.rol.id!;
    });

    this.typeDocumentService.listarTiposDeDocumentos().then(doc => {
      this.tiposDocumento = doc
    }).catch((error) => {
      console.log("Error al listar los documentos " + error);
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
      this.isLoading = true;
      const birthDate = new Date(this.formularioUsuario.value.birth_date);
      const today = new Date();
      var age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age > 80) {
        this.showAlert('error', 'Seleccione correctamente su fecha de nacimiento.');
        return;
      }

      var usuario: UsuarioPacienteRequest = {
        documentTypeId: Number(this.formularioUsuario.value.document_type),
        dni: this.formularioUsuario.value.dni,
        lastName: this.formularioUsuario.value.last_name,
        middleName: this.formularioUsuario.value.middle_name,
        firstName: this.formularioUsuario.value.first_name,
        birthDate: this.formularioUsuario.value.birth_date,
        gender: this.formularioUsuario.value.gender,
        telefono: this.formularioUsuario.value.telefono,
        email: this.formularioUsuario.value.email,
        password: this.formularioUsuario.value.password_hash,
      }

      this.usuarioService.registrarPaciente(usuario).then((response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        var mensaje = getRegisterTemplateHTML(usuario.firstName, usuario.lastName, usuario.email!, usuario.password)
        this.emailService.message(usuario.email!, "Bienvenido a la plataforma de citas médicas. Su registro ha sido exitoso.", mensaje).then((value) => { }).catch((error) => { });

        this.formularioUsuario.reset(this.formularioInicial);
        this.showAlert('success', 'Registro exitoso. Por favor verifica tu correo electrónico para más detalles.');

        if (!this.authService.isAuthenticated()) {
          this.router.navigate(['/login']);
        }
      }).catch((error) => {
        this.isLoading = false;
        console.error('Error al registrar paciente:', error.error.message);
        this.showAlert('error', error.error.message);
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
