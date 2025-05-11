import { NgClass } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Document_Type } from '../../interface/DocumentType.interface';
import { DocumentTypeService } from '../../services/document-type.service';
import { Especialidad } from '../../interface/Especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { UsuarioMedicoRequest } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { EmailService } from '../../services/email.service';
import { getRegisterTemplateHTML } from '../../utils/template';
import { LoadingComponent } from '../../pages/loading/loading.component';

@Component({
  selector: 'app-registrar-medico',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LoadingComponent],
  templateUrl: './registrar-medico.component.html',
  styleUrl: './registrar-medico.component.css'
})
export class RegistrarMedicoComponent {

  fb = inject(FormBuilder)
  typeDocumentService = inject(DocumentTypeService);
  especialidadService = inject(EspecialidadService);
  usuarioService = inject(AuthService);
  emailService = inject(EmailService);

  formularioMedico = this.fb.group({
    documentType: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    middleName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
    birthDate: ['', Validators.required],
    gender: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    especialidadId: ["", Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsMatchValidator });

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
  };

  tiposDocumento: Document_Type[] = [];
  especialidades: Especialidad[] = [];
  showPassword = false;
  showConfirm = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.typeDocumentService.listarTiposDeDocumentos().then(doc => {
      this.tiposDocumento = doc
    }).catch((error) => {
      console.log("Error al listar los documentos " + error);
    });

    this.especialidadService.listarEspecialidades().then(esp => {
      this.especialidades = esp;
    }).catch((error) => {
      console.log("Error al listar especialidades " + error);
    })
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirm() { this.showConfirm = !this.showConfirm; }

  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsNoMatch: true };
  }

  registrarMedico() {
    if (this.formularioMedico.invalid) return;

    this.isLoading = true;
    const birthDateRaw = this.formularioMedico.value.birthDate;

    if (birthDateRaw) {
      const birthDate = new Date(birthDateRaw);

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 18) {
        this.showAlert('error', 'El médico debe ser mayor de edad.');
        this.isLoading = false;
        return;
      }

      if (age > 80) {
        this.showAlert('error', 'Seleccione correctamente su fecha de nacimiento.');
        this.isLoading = false;
        return;
      }
    }

    var usuario: UsuarioMedicoRequest = {
      documentTypeId: Number(this.formularioMedico.value.documentType),
      dni: this.formularioMedico.value.dni,
      lastName: this.formularioMedico.value.lastName,
      middleName: this.formularioMedico.value.middleName,
      firstName: this.formularioMedico.value.firstName,
      birthDate: this.formularioMedico.value.birthDate,
      gender: this.formularioMedico.value.gender,
      telefono: this.formularioMedico.value.telefono,
      email: this.formularioMedico.value.email,
      password: this.formularioMedico.value.password,
      especialidadId: Number(this.formularioMedico.value.especialidadId)
    }

    console.log(usuario);
    this.usuarioService.registrarMedico(usuario).then(() => {
      console.log("medico registrado");
      this.isLoading = false;
      var mensaje = getRegisterTemplateHTML(usuario.firstName, usuario.lastName, usuario.email!, usuario.password)
      this.emailService.message(usuario.email!, "Bienvenido a la plataforma de citas médicas. Su registro ha sido exitoso.", mensaje).then((value) => { }).catch((error) => { });

      this.formularioMedico.reset(this.formularioInicial);
      this.showAlert('success', 'Registro exitoso. El médico ha sido registrado correctamente.');
    }).catch((error) => {
      this.isLoading = false;
      console.log("error al guardar el medico");
      console.error('Error al registrar médico:', error.error.message);
      this.showAlert('error', error.error.message);
    });

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
