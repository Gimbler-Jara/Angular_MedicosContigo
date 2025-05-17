import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Document_Type } from '../../interface/DocumentType.interface';
import { DocumentTypeService } from '../../services/document-type.service';
import { Especialidad } from '../../interface/Especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { getRegisterTemplateHTML } from '../../utils/template';
import { LoadingComponent } from '../../pages/loading/loading.component';
import { enviarCorreoBienvenida, mostrarErroresEdad, showAlert, validarEdad } from '../../utils/utilities';

@Component({
  selector: 'app-registrar-medico',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LoadingComponent, CommonModule],
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
    confirmPassword: ['', Validators.required],
    cmp: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]]
  }, { validators: this.passwordsMatchValidator });

  private formularioInicial = {
    documentType: "",
    dni: '',
    last_name: '',
    middle_name: '',
    first_name: '',
    birth_date: '',
    gender: '',
    telefono: '',
    email: '',
    password_hash: '',
    especialidadId: ""
  };

  selectedFile: File | null = null;

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

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  registrarMedico() {
    if (this.formularioMedico.invalid || !this.selectedFile) {
      showAlert('error', 'Debe completar todos los campos y adjuntar una firma.');
      return;
    }
    const birthDate = new Date(this.formularioMedico.value.birthDate);
    const edad = validarEdad(birthDate);
    if (mostrarErroresEdad(edad)) return;


    this.isLoading = true;
    const datos = {
      documentTypeId: this.formularioMedico.value.documentType,
      dni: this.formularioMedico.value.dni,
      lastName: this.formularioMedico.value.lastName,
      middleName: this.formularioMedico.value.middleName,
      firstName: this.formularioMedico.value.firstName,
      birthDate: this.formularioMedico.value.birthDate,
      gender: this.formularioMedico.value.gender,
      telefono: this.formularioMedico.value.telefono,
      email: this.formularioMedico.value.email,
      password: this.formularioMedico.value.password,
      especialidadId: this.formularioMedico.value.especialidadId,
      cmp: this.formularioMedico.value.cmp
    };

    const formData = new FormData();
    formData.append('datos', JSON.stringify(datos));
    formData.append('archivoFirmaDigital', this.selectedFile);

    var usuario = this.formularioMedico.value;

    this.usuarioService.registrarMedico(formData).then(() => {
      this.isLoading = false;
      this.formularioMedico.reset(this.formularioInicial);
      showAlert('success', 'Registro exitoso. El médico ha sido registrado correctamente.');
      this.selectedFile = null;
      enviarCorreoBienvenida(this.emailService, usuario.firstName, usuario.lastName, usuario.email!, usuario.password).then(() => {
        console.log("mensaje enviado");
      });
    }).catch((error) => {
      this.isLoading = false;
      console.error('Error al registrar médico:', error);
      showAlert('error', error?.error?.message || 'Error desconocido.');
    });

  }



}
