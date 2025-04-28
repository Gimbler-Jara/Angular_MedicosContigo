import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { MedicoConUsuario } from '../../interface/MedicoConUsuario.interface';
import { Especialidad } from '../../interface/Especialidad.interface';
import { AgendarCitaMedicaDTO } from '../../DTO/CitaMedica.interface';
import { UsuarioPacienteRequest, UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { MedicosPorEspecialidadDTO } from '../../DTO/MedicosPorEspecialidad.interface';
import { HorasDispiniblesDTO } from '../../DTO/HorasDispinibles.interface';
import { obtenerProximaFecha } from '../../utils/utilities';
import { CitasReservadasPorPacienteResponseDTO } from '../../DTO/CitasReservadasPorPaciente.interface';
import { DiaSemana } from '../../interface/DiaSemana.interface';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import { PacienteDTO } from '../../DTO/paciente.interface';
import { PacienteActualizacionDTO } from '../../DTO/PacienteActualizacion.interface';
import { PacienteService } from '../../services/paciente.service';
import { ModalEditarUsuarioComponent } from '../modal-editar-usuario/modal-editar-usuario.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, ModalEditarUsuarioComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  authService = inject(AuthService);
  citasService = inject(CitasService)
  especialidadService = inject(EspecialidadService)
  medicoService = inject(MedicoService)
  pacienteService = inject(PacienteService)

  vista: 'citas' | 'reservar' | 'extra' = 'citas';

  usuario: UsuarioResponse = this.authService.getUsuarioStorage()!;

  citasRegistradas: CitasReservadasPorPacienteResponseDTO[] = []


  especialidades$ = this.especialidadService.listarEspecialidades();
  especialidadSeleccionada?: Especialidad;
  // medicos = this.citasService.getMedicos();

  showPassword: boolean = false;
  showConfirm: boolean = false;

  medicosFiltrados: MedicosPorEspecialidadDTO[] = [];
  fechasFiltradas: DiaSemana[] = [];
  horasFiltradas: HorasDispiniblesDTO[] = [];
  tiposDocumento = [
    { value: 1, label: 'DNI' },
    { value: 2, label: 'Carnet de Extranjería' },
    { value: 3, label: 'Pasaporte' }
  ];

  // * EDITAR PACIENTE
  modalTipo: 'paciente' | 'medico' | null = null;
  modalTitulo: string = '';
  modalCampos: any[] = [];
  modalFormGroup!: FormGroup;
  mostrarModalUsuario: boolean = false;
  especialidades: Especialidad[] = [];

  pacienteEditado: PacienteDTO | null = null;

  // especialidadSeleccionada: Especialidad | null = null;
  medicoSeleccionado: MedicosPorEspecialidadDTO | null = null;
  diaSeleccionada: string | null = null;
  horaSeleccionada: number | null = null;
  fechaCitaSeleccionada: string | null = null;

  formularioUsuario: FormGroup;
  pacienteForm: FormGroup;

  constructor(private fb: FormBuilder, private citaService: CitasService) {
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

    this.pacienteForm = this.fb.group({
      idUsuario: [null],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      telefono: [''],
      birthDate: [''],
      gender: ['']
    });
  }


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.listarCitasReservadasPorPaciente();

    this.especialidadService.listarEspecialidades().then(data => {
      this.especialidades = data ?? [];
    }).catch((error) => {
      console.log("Error al listar las especialidades " + error);
    });
  }

  registrarUsuario() {
    if (this.formularioUsuario.valid) {
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
      console.log(usuario);
      // this.usuarioService.registrarPaciente(usuario)
      // this.formularioUsuario.reset(this.formularioInicial);
    }
  }

  seleccionarEspecialidad(esp: Especialidad) {
    this.especialidadSeleccionada = esp;
    this.medicoService.listarMedicosPorEspecialidad(esp.id).then((data) => {
      this.medicosFiltrados = data
      console.log(this.medicosFiltrados);

      this.medicoSeleccionado = null;
      this.diaSeleccionada = null;
      this.horaSeleccionada = null;
      this.fechasFiltradas = [];
      this.horasFiltradas = [];
    }).catch((error) => {
      console.log(error);
    });
  }

  seleccionarMedico(medico: MedicosPorEspecialidadDTO) {
    this.medicoSeleccionado = medico;
    this.medicoService.listarDiasDisponibles(medico.id!).then((datos) => {
      // const dias = datos;
      this.fechasFiltradas = datos;
      console.log(this.fechasFiltradas);
      this.diaSeleccionada = null;
      this.horasFiltradas = [];
    }).catch((error) => {
      console.log(error);
    });


  }

  seleccionarFecha(fecha: DiaSemana) {
    console.log(fecha);

    const dia = obtenerProximaFecha(fecha.dia);
    console.log(dia);
    this.fechaCitaSeleccionada = dia;

    this.diaSeleccionada = fecha.dia;
    if (this.medicoSeleccionado?.id == undefined)
      return;

    this.medicoService.listarHorasDisponibles(this.medicoSeleccionado.id, dia).then(data => {
      this.horasFiltradas = data ?? [];
    });
    // } else {
    //   console.error('El ID del médico seleccionado es undefined');
    // }
    this.horaSeleccionada = null;
  }

  seleccionarHora(hora: number) {
    this.horaSeleccionada = hora;
  }

  confirmarCita() {
    if (this.especialidadSeleccionada && this.medicoSeleccionado && this.diaSeleccionada && this.horaSeleccionada) {

      const nuevaCita: AgendarCitaMedicaDTO = {
        idMedico: this.medicoSeleccionado.id!,
        idPaciente: this.usuario.id ?? 1,
        fecha: this.fechaCitaSeleccionada!,
        idHora: this.horaSeleccionada,
        estado: 1
      }

      console.log(nuevaCita);
      this.citaService.agendarCita(nuevaCita)

      // this.especialidadSeleccionada = null;
      this.medicoSeleccionado = null;
      this.diaSeleccionada = null;
      this.horaSeleccionada = null;
      this.medicosFiltrados = [];
      this.fechasFiltradas = [];
      this.horasFiltradas = [];
    }
  }

  // Cuando quieres abrir el modal de edición:
  abrirModalEditarPacienteDesdePerfil() {
    // Crea un DTO compatible:
    const pacienteFake: PacienteDTO = {
      idUsuario: this.usuario.id!, // Usa el id de usuario
      usuario: this.usuario        // Pasa el objeto de usuario
    };
    // Ahora sí puedes usar tu modal genérico
    this.abrirModalEditarPaciente(pacienteFake);
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
            // this.authService.setUsuario(res.);
          }
        })
        .catch(() => alert('Error al actualizar paciente'));
    }
  }


  cerrarModalUsuario() {
    this.mostrarModalUsuario = false;
    this.modalTipo = null;
    this.modalFormGroup.reset();
  }






  // obtenerIdHora(hora: number): number {
  //   const todasHoras = this.citaService.getHorasDisponibles(this.fechaSeleccionada!);
  //   return todasHoras.indexOf(hora) + 1; // simulado, reemplazar por ID real si tienes mapeo
  // }

  getHoraTexto(id: number): string {
    return this.citaService.getHoraById(id);
  }



  // getNombreMedico(id: number): string {
  //   const medico = this.citaService.getMedicos().find(m => m.usuario.id === id);
  //   return medico ? `${medico.usuario.firstName} ${medico.usuario.lastName}` : 'Desconocido';
  // }

  // getEspecialidadMedico(id: number): string {
  //   const medico = this.citaService.getMedicos().find(m => m.usuario.id === id);
  //   const esp = this.citaService.getEspecialidades().find(e => e.id === medico?.especialidad_id);
  //   return esp ? esp.especialidad : 'Especialidad no registrada';
  // }


  cambiarVista(nuevaVista: 'citas' | 'reservar' | 'extra') {
    this.vista = nuevaVista;
    if (nuevaVista === 'citas') {
      this.listarCitasReservadasPorPaciente();
    }
  }

  async listarCitasReservadasPorPaciente() {
    this.citaService.listarCitasReservadasPorPaciente(this.usuario.id!).then((data) => {
      this.citasRegistradas = data ?? [];
    })
  }

  cancelarCita(idCita: number) {
    this.citaService.eliminarCitaReservado(idCita).then(res => {
      this.listarCitasReservadasPorPaciente();
    }).catch((error) => {
      console.log("Error ala eliminar cita " + error);

    })
  }


  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password_hash')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNoMatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm(): void {
    this.showConfirm = !this.showConfirm;
  }
}