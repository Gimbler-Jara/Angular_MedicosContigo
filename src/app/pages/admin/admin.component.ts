import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RegistrarMedicoComponent } from '../../auth/registrar-medico/registrar-medico.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { MedicoService } from '../../services/medico.service';
import { MedicoDTO } from '../../DTO/medico.DTO';
import { Paciente } from '../../DTO/paciente.DTO';
import { PacienteService } from '../../services/paciente.service';
import { AuthService } from '../../services/auth.service';
import { PacienteActualizacionDTO } from '../../DTO/PacienteActualizacion.DTO';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MedicoActualizacionDTO } from '../../DTO/MedicoActualizacion.DTO';
import { Especialidad } from '../../interface/Especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { ModalEditarUsuarioComponent } from '../modal-editar-usuario/modal-editar-usuario.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { UsuarioStorage } from '../../DTO/UsuarioStorage.DTO';
import { LoadingComponent } from '../loading/loading.component';
import {
  mostrarErroresEdad,
  obtenerCamposUsuario,
  obtenerValidacionesDeCamposUsuario,
  showAlert,
  validarEdad,
} from '../../utils/utilities';
import { TABS } from '../../utils/constants';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgClass,
    RegistrarMedicoComponent,
    RegisterComponent,
    ReactiveFormsModule,
    ModalEditarUsuarioComponent,
    DatePipe,
    LoadingComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  medicoService = inject(MedicoService);
  localStorageService = inject(LocalStorageService);
  pacienteService = inject(PacienteService);
  authService = inject(AuthService);
  especialidadService = inject(EspecialidadService);
  fb = inject(FormBuilder);

  isLoading: boolean = false;

  selectedGestion: 'medico' | 'paciente' | 'admin' = 'medico';
  selectedTab: string = 'registrar';
  especialidades: Especialidad[] = [];
  rol: string = '';

  tabs = TABS;

  medicos: MedicoDTO[] = [];
  pacientes: Paciente[] = [];

  // pacienteForm: FormGroup;
  // medicoForm: FormGroup;

  usuario: UsuarioStorage = this.localStorageService.getUsuario()!;

  modalTipo: 'paciente' | 'medico' = 'paciente';
  modalTitulo: string = '';
  modalCampos: any[] = [];
  modalFormGroup!: FormGroup;
  mostrarModalUsuario: boolean = false;

  pacienteEditado: Paciente | null = null;
  medicoEditado: MedicoDTO | null = null;

  constructor() {
    // this.pacienteForm = this.fb.group({
    //   idUsuario: [null],
    //   firstName: [''],
    //   middleName: [''],
    //   lastName: [''],
    //   telefono: [''],
    // });
    // this.medicoForm = this.fb.group({
    //   firstName: ['', Validators.required],
    //   middleName: [''],
    //   lastName: ['', Validators.required],
    //   telefono: [''],
    //   gender: ['', Validators.required],
    //   especialidadId: [null, Validators.required]
    // });
  }

  ngOnInit(): void {
    this.especialidadService
      .listarEspecialidades()
      .then((data) => {
        this.especialidades = data.especialidades ?? [];
      })
      .catch((error) => {
        console.log('Error al listar las especialidades ' + error);
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
      this.isLoading = true;
      this.listarMedicos()
        .then(() => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    }

    if (this.selectedGestion === 'paciente' && tabKey === 'listar') {
      this.isLoading = true;
      this.listarPacientes()
        .then(() => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    }
  }

  listarPacientes() {
    return new Promise<void>((resolve, reject) => {
      this.pacienteService
        .listarPacientes()
        .then((data) => {
          console.log(data);
          this.pacientes = data.pacientes;
          resolve();
        })
        .catch((error) => {
          console.log('Error al listar los pacientes ' + error);
          reject(error);
        });
    }); // Simulación de carga
  }

  listarMedicos() {
    return new Promise<void>((resolve, reject) => {
      this.medicoService
        .listarMedicos()
        .then((data) => {
          this.medicos = data.medicos;
          resolve();
        })
        .catch((error) => {
          console.log('Error al listar los medicos ' + error);
          reject(error);
        });
    });
  }

  cambiarEstadoActivo(id: number) {
    this.isLoading = true;
    this.authService
      .cambiarEstadoUsuario(id)
      .then((data) => {
        this.listarMedicos();
        this.listarPacientes();
        this.isLoading = false;
        showAlert('success', data.mensaje);
      })
      .catch((error) => {
        this.isLoading = false;
        console.log('Error al ocultar el paciente ' + error);
      });
  }

  abrirModalEditarPaciente(paciente: Paciente) {
    this.modalFormGroup = this.fb.group(
      obtenerValidacionesDeCamposUsuario(paciente.usuario)
    );
    this.pacienteEditado = structuredClone(paciente);

    this.modalTipo = 'paciente';
    this.modalTitulo = 'Editar Paciente';
    this.modalCampos = obtenerCamposUsuario();

    this.mostrarModalUsuario = true;
  }

  abrirModalEditarMedico(medico: MedicoDTO) {
    const controles = {
      ...obtenerValidacionesDeCamposUsuario(medico.usuario),
      especialidadId: [medico.especialidad?.id || null, Validators.required],
      cmp: [medico.cmp || null, Validators.required],
    };

    this.modalFormGroup = this.fb.group(controles);
    this.medicoEditado = structuredClone(medico);

    this.modalTipo = 'medico';
    this.modalTitulo = 'Editar Médico';
    this.modalCampos = obtenerCamposUsuario(true);

    this.mostrarModalUsuario = true;
  }

  guardarCambiosUsuario(payload: { datos: any; archivo?: File }) {
    const datosFormulario = payload.datos;
    const archivo = payload.archivo;

    console.log(datosFormulario.birthDate);

    const birthDate = new Date(datosFormulario.birthDate);
    const edad = validarEdad(birthDate);
    if (mostrarErroresEdad(edad)) return;

    this.isLoading = true;

    if (this.modalTipo === 'paciente' && this.pacienteEditado) {
      const datos: PacienteActualizacionDTO = {
        idUsuario: this.pacienteEditado.idUsuario,
        ...datosFormulario,
      };
      console.log(datos);

      this.pacienteService
        .actualizarPaciente(datos.idUsuario, datos)
        .then((res) => {
          if (res.httpStatus == 200) {
            this.cerrarModalUsuario();
            this.listarPacientes();
            showAlert('success', res.mensaje);
          }
        })
        .catch(() => {
          showAlert('error', 'Error al actualizar paciente');
          this.isLoading = false;
        });
    }

    if (this.modalTipo === 'medico' && this.medicoEditado) {
      const datos: MedicoActualizacionDTO = {
        idUsuario: this.medicoEditado.usuario.id,
        ...datosFormulario,
      };

      this.medicoService
        .actualizarMedicoConArchivo(
          this.medicoEditado.idUsuario,
          datos,
          archivo
        )
        .then((res) => {
          if (res.httpStatus == 200) {
            this.cerrarModalUsuario();
            this.listarMedicos();
            showAlert('success', res.mensaje);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          showAlert('error', 'Error al actualizar médico');
          console.log('Error al actualizar médico ' + err.error.mensaje);
        });
    }
  }

  cerrarModalUsuario() {
    this.isLoading = false;
    this.mostrarModalUsuario = false;
    this.modalTipo = 'paciente';
    this.modalFormGroup.reset();
  }
}
