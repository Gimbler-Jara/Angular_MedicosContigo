import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CitasService } from '../../services/citas.service';
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
import { LocalStorageService } from '../../services/local-storage.service';
import { EmailService } from '../../services/email.service';
import { getCancelarCitaTemplaeHTML, getReservarCitaTemplateHTML } from '../../utils/template';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, ModalEditarUsuarioComponent, DatePipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  citasService = inject(CitasService)
  especialidadService = inject(EspecialidadService)
  medicoService = inject(MedicoService)
  pacienteService = inject(PacienteService)
  emailService = inject(EmailService);

  vista: 'citas' | 'reservar' | 'extra' = 'citas';

  usuario: UsuarioResponse = this.localStorageService.getUsuarioStorage()!;

  citasRegistradas: CitasReservadasPorPacienteResponseDTO[] = []
  citasAtendidas: CitasReservadasPorPacienteResponseDTO[] = []


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
  // pacienteForm: FormGroup;

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
  }


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.listarCitasPorPaciente();

    this.especialidadService.listarEspecialidades().then(data => {
      this.especialidades = data ?? [];
    }).catch((error) => {
      console.log("Error al listar las especialidades " + error);
    });
  }

  seleccionarEspecialidad(esp: Especialidad) {
    this.especialidadSeleccionada = esp;
    this.medicoService.listarMedicosPorEspecialidad(esp.id).then((data) => {
      this.medicosFiltrados = data ?? [];
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
      this.fechasFiltradas = datos ?? [];
      this.diaSeleccionada = null;
      this.horasFiltradas = [];
    }).catch((error) => {
      console.log(error);
    });


  }

  seleccionarFecha(fecha: DiaSemana) {
    const dia = obtenerProximaFecha(fecha.dia);
    this.fechaCitaSeleccionada = dia;

    this.diaSeleccionada = fecha.dia;
    if (this.medicoSeleccionado?.id == undefined)
      return;
    console.log(fecha);

    console.log(dia);
    this.medicoService.listarHorasDisponibles(this.medicoSeleccionado.id, dia).then(data => {
      this.horasFiltradas = data ?? [];
    });
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

      this.citaService.agendarCita(nuevaCita).then(() => {

        this.showAlert('success', 'Cita médica agendada correctamente.');
        var mensaje = getReservarCitaTemplateHTML(this.usuario.firstName, this.usuario.lastName, nuevaCita.fecha, this.getHoraTexto(this.horaSeleccionada!), this.medicoSeleccionado?.medico!, "", this.especialidadSeleccionada?.especialidad!);
        this.emailService.message(this.usuario.email!, "Cita médica agendada", mensaje).then((value) => { }).catch((error) => { });

        // this.especialidadSeleccionada = null;
        this.medicoSeleccionado = null;
        this.diaSeleccionada = null;
        this.horaSeleccionada = null;
        this.medicosFiltrados = [];
        this.fechasFiltradas = [];
        this.horasFiltradas = [];
      }).catch((error) => {
        this.showAlert('error', 'Error al agendar la cita médica.');
      });

    }
  }

  abrirModalEditarPacienteDesdePerfil() {
    const pacienteFake: PacienteDTO = {
      idUsuario: this.usuario.id!,
      usuario: this.usuario
    };

    this.abrirModalEditarPaciente(pacienteFake);
  }


  abrirModalEditarPaciente(paciente: PacienteDTO) {
    this.modalFormGroup = this.fb.group({
      idUsuario: [paciente.idUsuario],
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
      { name: 'telefono', label: 'Teléfono' }
    ];
    this.mostrarModalUsuario = true;
  }


  guardarCambiosUsuario() {
    if (this.modalTipo === 'paciente' && this.pacienteEditado) {
      const dto: PacienteActualizacionDTO = {
        idUsuario: this.pacienteEditado.idUsuario,
        ...this.modalFormGroup.value
      };

      console.log(dto);

      this.pacienteService.actualizarPaciente(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {
            this.usuario.middleName = dto.middleName;
            this.usuario.firstName = dto.firstName;
            this.usuario.lastName = dto.lastName;
            this.usuario.telefono = dto.telefono;

            this.localStorageService.setUsuario(this.usuario);
            this.cerrarModalUsuario();
            this.showAlert('success', "Datos actualizados correctamente");
          }
        })
        .catch(() =>
          this.showAlert('error', 'Error al actualizar paciente')
        );
    }
  }


  cerrarModalUsuario() {
    this.mostrarModalUsuario = false;
    this.modalTipo = null;
    this.modalFormGroup.reset();
  }

  getHoraTexto(id: number): string {
    return this.citaService.getHoraById(id);
  }

  cambiarVista(nuevaVista: 'citas' | 'reservar' | 'extra') {
    this.vista = nuevaVista;
    if (nuevaVista === 'citas') {
      this.listarCitasPorPaciente();
    }
  }

  async listarCitasPorPaciente() {
    this.citaService.listarCitasReservadasPorPaciente(this.usuario.id!).then((data) => {
      console.log(data);

      this.citasRegistradas = [];
      this.citasAtendidas = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].estado.toLocaleLowerCase() != "atendido") {
          this.citasRegistradas.push(data[i]);
        }else{
          this.citasAtendidas.push(data[i]);
        }
      }
    })
  }

  cancelarCita(idCita: number) {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "Cancelaras la cita médica",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.eliminarCitaReservado(idCita).then(() => {
          this.listarCitasPorPaciente();
          var citaEncontrada = this.citasRegistradas.find(c => c.id == idCita);
          var formattedFecha = new Date(citaEncontrada!.fecha).toISOString().split('T')[0];

          var mensaje = getCancelarCitaTemplaeHTML(this.usuario.firstName, this.usuario.lastName, formattedFecha, this.getHoraTexto(citaEncontrada?.idHora!), citaEncontrada?.medico!, "", citaEncontrada?.especialidad!);
          this.emailService.message(this.usuario.email!, "Cita médica cancelada", mensaje).then((value) => { }).catch((error) => { });
          this.showAlert('success', "Cita cancelada correctamente");
        }).catch((error) => {
          console.log("Error ala eliminar cita " + error);
          this.showAlert('error', "Error al cancelar la cita");
        })
      }
    });
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