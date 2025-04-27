import { NgClass } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Document_Type } from '../../interface/DocumentType.interface';
import { DocumentTypeService } from '../../services/document-type.service';
import { Especialidad } from '../../interface/Especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { UsuarioMedicoRequest } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrar-medico',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './registrar-medico.component.html',
  styleUrl: './registrar-medico.component.css'
})
export class RegistrarMedicoComponent {

  fb = inject(FormBuilder)
  typeDocumentService = inject(DocumentTypeService);
  especialidadService = inject(EspecialidadService);
  usuarioService = inject(AuthService);

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


  // Lista de tipos de documento y especialidades 
  tiposDocumento: Document_Type[] = [];
  especialidades: Especialidad[] = [];

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


  // Mostrar/ocultar contraseña
  showPassword = false;
  showConfirm = false;
  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirm() { this.showConfirm = !this.showConfirm; }

  // Validador personalizado para contraseñas
  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsNoMatch: true };
  }

  // Método para enviar el formulario
  registrarMedico() {
    if (this.formularioMedico.invalid) return;

    // const medico = { ...this.formularioMedico.value };
    // // Elimina el confirmPassword antes de enviar al backend
    // delete medico.confirmPassword;

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
    }).catch((error) => {
      console.log("error al guardar el medico");
    });

  }

}
