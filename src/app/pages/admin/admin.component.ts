import { CommonModule, NgClass } from '@angular/common';
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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgClass, RegistrarMedicoComponent, RegisterComponent, ReactiveFormsModule, ModalEditarUsuarioComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  medicoService = inject(MedicoService)
  pacienteService = inject(PacienteService)
  authService = inject(AuthService);
  especialidadService = inject(EspecialidadService);

  selectedGestion: 'medico' | 'paciente' | 'admin' = 'medico';
  selectedTab: string = 'registrar';
  especialidades: Especialidad[] = [];

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

  usuario: UsuarioResponse = this.authService.getUsuarioStorage()!;

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
      birthDate: [''],
      gender: ['']
    });

    this.medicoForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      telefono: [''],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      especialidadId: [null, Validators.required]
    });
  }




  ngOnInit(): void {
    this.listarMedicos();
    this.listarPacientes();
    this.especialidadService.listarEspecialidades().then(data => {
      this.especialidades = data ?? [];
    }).catch((error) => {
      console.log("Error al listar las especialidades " + error);
    });
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
      console.log(this.medicos);
    }).catch((error) => {
      console.log("Error al listar los medicos " + error);
    })
  }

  eliminarUsuario(id: number) {
    console.log(id);
    this.pacienteService.eliminarPaciente(id).then(() => {
      this.listarPacientes();
    }).catch((error) => {
      console.log("Error al eliminar el paciente " + error);
    });
  }



  eliminarMedico(id: number) {
    console.log(id);
    this.medicoService.eliminarMedico(id).then(() => {
      this.listarMedicos();
    }).catch((error) => {
      console.log("Error al eliminar el paciente " + error);
    });
  }

  abrirModalEditarPaciente(paciente: PacienteDTO) {
    this.modalFormGroup = this.fb.group({
      idUsuario: [paciente.idUsuario], // <--- SIEMPRE estará presente en el dto
      firstName: [paciente.usuario.firstName || '', Validators.required],
      middleName: [paciente.usuario.middleName || ''],
      lastName: [paciente.usuario.lastName || '', Validators.required],
      telefono: [paciente.usuario.telefono || ''],
      birthDate: [paciente.usuario.birthDate || '', Validators.required],
      gender: [paciente.usuario.gender || '', Validators.required]
    });
  
    this.pacienteEditado = JSON.parse(JSON.stringify(paciente));
    this.modalTipo = 'paciente';
    this.modalTitulo = 'Editar Paciente';
    this.modalCampos = [
      { name: 'firstName', label: 'Nombre' },
      { name: 'middleName', label: 'Apellido Materno' },
      { name: 'lastName', label: 'Apellido Paterno' },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'birthDate', label: 'Fecha de nacimiento', type: 'date' },
      {
        name: 'gender', label: 'Género', type: 'select', options: [
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' },
          { value: 'O', label: 'Otro' }
        ]
      }
    ];
    this.mostrarModalUsuario = true;
  }
  

  abrirModalEditarMedico(medico: MedicoDTO) {
    this.medicoEditado = JSON.parse(JSON.stringify(medico));
    this.modalTipo = 'medico';
    this.modalTitulo = 'Editar Médico';
    this.modalCampos = [
      { name: 'firstName', label: 'Nombre' },
      { name: 'middleName', label: 'Apellido Materno' },
      { name: 'lastName', label: 'Apellido Paterno' },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'birthDate', label: 'Fecha de nacimiento', type: 'date' },
      {
        name: 'gender', label: 'Género', type: 'select', options: [
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' },
          { value: 'O', label: 'Otro' }
        ]
      },
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
    if (this.modalTipo === 'paciente' && this.pacienteEditado) {
      const dto: PacienteActualizacionDTO = {
        idUsuario: this.pacienteEditado.idUsuario, // Asegura el ID aquí
        ...this.modalFormGroup.value
      };

      console.log(dto);
      
      this.pacienteService.actualizarPaciente(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {
            alert(res.message);
            this.cerrarModalUsuario();
            this.listarPacientes();
          }
        })
        .catch(() => alert('Error al actualizar paciente'));
    }

    if (this.modalTipo === 'medico' && this.medicoEditado) {
      const dto: MedicoActualizacionDTO = {
        idUsuario: this.medicoEditado.idUsuario,
        ...this.modalFormGroup.value
      };
      this.medicoService.actualizarMedico(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {
            alert(res.message);
            this.cerrarModalUsuario();
            this.listarMedicos();
          }
        })
        .catch(() => alert('Error al actualizar médico'));
    }
  }

  cerrarModalUsuario() {
    this.mostrarModalUsuario = false;
    this.modalTipo = null;
    this.modalFormGroup.reset();
  }

}
