import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input, NgModule } from '@angular/core';
import { RegistrarMedicoComponent } from '../../auth/registrar-medico/registrar-medico.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { MedicoService } from '../../services/medico.service';
import { MedicoDTO } from '../../DTO/medico.interface';
import { PacienteDTO } from '../../DTO/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';
import { PacienteActualizacionDTO } from '../../DTO/PacienteActualizacion.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicoActualizacionDTO } from '../../DTO/MedicoActualizacion.interface';
import { Especialidad } from '../../interface/Especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { ModalEditarUsuarioComponent } from '../modal-editar-usuario/modal-editar-usuario.component';
import { LocalStorageService } from '../../services/local-storage.service';
import Swal from 'sweetalert2';
import { UsuarioStorage } from '../../DTO/UsuarioStorage.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgClass, RegistrarMedicoComponent, RegisterComponent, ReactiveFormsModule, ModalEditarUsuarioComponent, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  medicoService = inject(MedicoService)
  localStorageService = inject(LocalStorageService);
  pacienteService = inject(PacienteService)
  authService = inject(AuthService);
  especialidadService = inject(EspecialidadService);

  selectedGestion: 'medico' | 'paciente' | 'admin' = 'medico';
  selectedTab: string = 'registrar';
  especialidades: Especialidad[] = [];
  rol: string = "";

  tabs = {
    medico: [
      { key: 'registrar', label: 'Registrar médico' },
      { key: 'listar', label: 'Listar médicos' }
    ],
    paciente: [
      { key: 'registrar', label: 'Registrar paciente' },
      { key: 'listar', label: 'Listar pacientes' }
    ],
    admin: [
      { key: 'registrar', label: 'Registrar admin' },
      { key: 'listar', label: 'Listar admins' }
    ]
  };

  medicos: MedicoDTO[] = [];
  pacientes: PacienteDTO[] = [];

  pacienteForm: FormGroup;
  medicoForm: FormGroup;

  usuario: UsuarioStorage = this.localStorageService.getUsuario()!;

  modalTipo: 'paciente' | 'medico' | null = null;
  modalTitulo: string = '';
  modalCampos: any[] = [];
  modalFormGroup!: FormGroup;
  mostrarModalUsuario: boolean = false;

  pacienteEditado: PacienteDTO | null = null;
  medicoEditado: MedicoDTO | null = null;


  constructor(private fb: FormBuilder) {
    this.pacienteForm = this.fb.group({
      idUsuario: [null],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      telefono: [''],
    });

    this.medicoForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      telefono: [''],
      gender: ['', Validators.required],
      especialidadId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // this.listarMedicos();
    // this.listarPacientes();
    this.especialidadService.listarEspecialidades().then(data => {
      this.especialidades = data ?? [];
    }).catch((error) => {
      console.log("Error al listar las especialidades " + error);
    });

    this.rol = this.authService.getUserRole() ?? '';
  }

  get currentTabs() {
    return this.tabs[this.selectedGestion];
  }

  selectGestion(gestion: 'medico' | 'paciente' | 'admin') {
    this.selectedGestion = gestion;
    this.selectedTab = 'registrar';
  }

  selectTab(tabKey: string) {
    this.selectedTab = tabKey;

    if (this.selectedGestion === 'medico' && tabKey === 'listar') {
      this.listarMedicos();
    }

    if (this.selectedGestion === 'paciente' && tabKey === 'listar') {
      this.listarPacientes();
    }
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().then(data => {
      this.pacientes = data;
    }).catch((error) => {
      console.log("Error al listar los pacientes " + error);
    })
  }


  listarMedicos() {
    this.medicoService.listarMedicos().then(_medicos => {
      this.medicos = _medicos;
    }).catch((error) => {
      console.log("Error al listar los medicos " + error);
    })
  }

  cambiarEstadoActivo(id: number) {
    this.authService.cambiarEstadoUsuario(id).then((data) => {
      this.listarMedicos();
      this.listarPacientes();
      console.log(data.message);
    }).catch((error) => {
      console.log("Error al ocultar el paciente " + error);
    });
  }

  abrirModalEditarPaciente(paciente: PacienteDTO) {
    this.modalFormGroup = this.fb.group({
      idUsuario: [paciente.idUsuario],
      firstName: [paciente.usuario.firstName || '', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      middleName: [paciente.usuario.middleName || '', [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      lastName: [paciente.usuario.lastName || '', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      telefono: [paciente.usuario.telefono || '', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });

    this.pacienteEditado = JSON.parse(JSON.stringify(paciente));
    this.modalTipo = 'paciente';
    this.modalTitulo = 'Editar Paciente';
    this.modalCampos = [
      { name: 'firstName', label: 'Nombre' },
      { name: 'middleName', label: 'Apellido Materno' },
      { name: 'lastName', label: 'Apellido Paterno' },
      { name: 'telefono', label: 'Teléfono' }
    ];
    this.mostrarModalUsuario = true;
  }



  abrirModalEditarMedico(medico: MedicoDTO) {
    this.medicoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      middleName: ['', [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
      telefono: ['', [Validators.pattern(/^\d{9}$/)]],
      especialidadId: [null, Validators.required]
    });


    this.medicoEditado = JSON.parse(JSON.stringify(medico));
    this.modalTipo = 'medico';
    this.modalTitulo = 'Editar Médico';
    this.modalCampos = [
      { name: 'firstName', label: 'Nombre' },
      { name: 'middleName', label: 'Apellido Materno' },
      { name: 'lastName', label: 'Apellido Paterno' },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'especialidadId', label: 'Especialidad', type: 'especialidad' }
    ];
    this.modalFormGroup = this.medicoForm;
    this.modalFormGroup.patchValue({
      ...medico.usuario,
      especialidadId: medico.especialidad?.id
    });
    this.mostrarModalUsuario = true;
  }

  guardarCambiosUsuario() {
    if (!this.modalFormGroup.valid) {
      this.showAlert('warning', 'Por favor, complete todos los campos correctamente.');
      console.log(this.modalFormGroup.errors);

      return;
    }

    if (this.modalTipo === 'paciente' && this.pacienteEditado) {
      const dto: PacienteActualizacionDTO = {
        idUsuario: this.pacienteEditado.idUsuario,
        ...this.modalFormGroup.value
      };

      this.pacienteService.actualizarPaciente(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {
            this.showAlert('success', res.message);
            this.cerrarModalUsuario();
            this.listarPacientes();
          }
        })
        .catch(() => {
          this.showAlert('error', 'Error al actualizar paciente')
        });
    }

    if (this.modalTipo === 'medico' && this.medicoEditado) {
      const dto: MedicoActualizacionDTO = {
        idUsuario: this.medicoEditado.idUsuario,
        ...this.modalFormGroup.value
      };
      this.medicoService.actualizarMedico(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {
            this.showAlert('success', res.message);
            this.cerrarModalUsuario();
            this.listarMedicos();
          }
        })
        .catch((error) => {
          this.showAlert('error', 'Error al actualizar médico')
          console.log("Error al actualizar médico " + error.error.message);
        });
    }
  }

  cerrarModalUsuario() {
    this.mostrarModalUsuario = false;
    this.modalTipo = null;
    this.modalFormGroup.reset();
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
