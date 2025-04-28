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

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, NgClass],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  authService = inject(AuthService);
  citasService = inject(CitasService)
  especialidadService = inject(EspecialidadService)
  medicoService = inject(MedicoService)

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

  // especialidadSeleccionada: Especialidad | null = null;
  medicoSeleccionado: MedicosPorEspecialidadDTO | null = null;
  diaSeleccionada: string | null = null;
  horaSeleccionada: number | null = null;
  fechaCitaSeleccionada: string | null = null;

  formularioUsuario: FormGroup;

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
    this.listarCitasReservadasPorPaciente();
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