import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Especialidad } from '../../interface/Especialidad.interface';
import { AgendarCitaMedicaDTO } from '../../DTO/CitaMedica.DTO';
import { UsuarioPacienteRequest, UsuarioResponse } from '../../interface/Usuario/Usuario.interface';
import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { MedicosPorEspecialidadDTO } from '../../DTO/MedicosPorEspecialidad.DTO';
import { HorasDispiniblesDTO } from '../../DTO/HorasDispinibles.DTO';
import { obtenerCamposUsuario, obtenerProximaFecha, obtenerValidacionesDeCamposUsuario, showAlert, validarEdad } from '../../utils/utilities';
import { CitasReservadasPorPacienteResponseDTO } from '../../DTO/CitasReservadasPorPaciente.DTO';
import { DiaSemana } from '../../interface/DiaSemana.interface';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import { PacienteDTO } from '../../DTO/paciente.DTO';
import { PacienteActualizacionDTO } from '../../DTO/PacienteActualizacion.DTO';
import { PacienteService } from '../../services/paciente.service';
import { ModalEditarUsuarioComponent } from '../modal-editar-usuario/modal-editar-usuario.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { EmailService } from '../../services/email.service';
import { getCancelarCitaTemplaeHTML, getReservarCitaTemplateHTML } from '../../utils/template';
import Swal from 'sweetalert2';
import { DetalleCitaAtendidaDTO } from '../../DTO/DetalleCitaAtendida.DTO';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UsuarioStorage } from '../../DTO/UsuarioStorage.DTO';
import { QRCodeComponent } from 'angularx-qrcode';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule,
    ModalEditarUsuarioComponent, DatePipe,
    CommonModule, QRCodeComponent],
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
  router = inject(Router)

  vista: 'citas' | 'reservar' | 'extra' = 'citas';

  usuario: UsuarioStorage = this.localStorageService.getUsuario()!;

  citasRegistradas: CitasReservadasPorPacienteResponseDTO[] = []
  citasAtendidas: CitasReservadasPorPacienteResponseDTO[] = []


  especialidades$ = this.especialidadService.listarEspecialidades();
  especialidadSeleccionada?: Especialidad;
  // medicos = this.citasService.getMedicos();
  rol: string = "";
  qrData: string = '';
  urlFirma: string = "";

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

  tipoCita = [
    { value: 0, label: "Presencial" },
    { value: 1, label: "Teleconsulta" }
  ]

  // * EDITAR PACIENTE
  modalTipo: 'paciente' | 'medico' | null = null;
  modalTitulo: string = '';
  modalCampos: any[] = [];
  modalFormGroup!: FormGroup;
  mostrarModalUsuario: boolean = false;
  especialidades: Especialidad[] = [];

  pacienteEditado: PacienteDTO | null = null;

  medicoSeleccionado: MedicosPorEspecialidadDTO | null = null;
  diaSeleccionada: string | null = null;
  fechaCitaSeleccionada: string | null = null;
  horaSeleccionada: number | null = null;
  tipoCitaSeleccionada: number = -1;

  mostrarModalDiagnosticoPaciente: boolean = false;
  detalleCita!: DetalleCitaAtendidaDTO;

  formularioUsuario: FormGroup;
  // pacienteForm: FormGroup;

  fechaActual: Date = new Date();

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

    this.rol = this.authService.getUserRole() ?? '';
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
    // console.log(fecha);

    // console.log(dia);
    this.medicoService.listarHorasDisponibles(this.medicoSeleccionado.id, dia).then(data => {
      this.horasFiltradas = data ?? [];
    });
    this.horaSeleccionada = null;
  }

  obtenerProximaFecha(diaSemana: string): string {
    return obtenerProximaFecha(diaSemana);
  }

  seleccionarHora(hora: number) {
    this.horaSeleccionada = hora;
  }

  seleccionarTipoCita(tipo: number) {
    this.tipoCitaSeleccionada = tipo;
  }

  confirmarCita() {
    if (this.especialidadSeleccionada && this.medicoSeleccionado && this.diaSeleccionada && this.horaSeleccionada) {

      const nuevaCita: AgendarCitaMedicaDTO = {
        idMedico: this.medicoSeleccionado.id!,
        idPaciente: this.usuario.id ?? 1,
        fecha: this.fechaCitaSeleccionada!,
        idHora: this.horaSeleccionada,
        estado: 1,
        tipoCita: this.tipoCitaSeleccionada
      }

      this.citaService.agendarCita(nuevaCita).then(() => {

        showAlert('success', 'Cita médica agendada correctamente.');
        var mensaje = getReservarCitaTemplateHTML(this.usuario.firstName, this.usuario.lastName, nuevaCita.fecha, this.getHoraTexto(this.horaSeleccionada!), this.medicoSeleccionado?.medico!, "", this.especialidadSeleccionada?.especialidad!);
        this.emailService.message(this.usuario.email!, "Cita médica agendada", mensaje).then((value) => { }).catch((error) => { });

        this.medicoSeleccionado = null;
        this.diaSeleccionada = null;
        this.horaSeleccionada = null;
        this.medicosFiltrados = [];
        this.fechasFiltradas = [];
        this.horasFiltradas = [];
        this.tipoCitaSeleccionada = -1;
      }).catch((error) => {
        showAlert('error', 'Error al agendar la cita médica.');
      });

    }
  }

  abrirModalEditarPacienteDesdePerfil() {
    this.authService.getPerfilUsuario().subscribe(usuario => {
      const pacienteFake: PacienteDTO = {
        idUsuario: usuario.id!,
        usuario: usuario
      };

      this.abrirModalEditarPaciente(pacienteFake);
    });
  }


  abrirModalEditarPaciente(paciente: PacienteDTO) {
    this.modalFormGroup = this.fb.group(obtenerValidacionesDeCamposUsuario(paciente.usuario));
    this.pacienteEditado = structuredClone(paciente);

    this.modalTipo = 'paciente';
    this.modalTitulo = 'Editar Datos';

    this.modalCampos = obtenerCamposUsuario();

    this.mostrarModalUsuario = true;
  }

  guardarCambiosUsuario(payload: { datos: any, archivo?: File }) {
    const datosFormulario = payload.datos;

    const birthDate = new Date(datosFormulario.birthDate);
    const edad = validarEdad(birthDate);

    if (edad < 18) {
      showAlert('error', 'La Edad debe de ser mayor a 18 años.');
      return;
    }

    if (edad > 80) {
      showAlert('error', 'Seleccione correctamente su fecha de nacimiento.');
      return;
    }

    if (this.modalTipo === 'paciente' && this.pacienteEditado) {
      const dto: PacienteActualizacionDTO = {
        idUsuario: this.pacienteEditado.idUsuario,
        ...datosFormulario
      };

      this.pacienteService.actualizarPaciente(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {

            var usuarioActualizado: UsuarioStorage = {
              id: this.usuario.id,
              firstName: datosFormulario.firstName,
              lastName: datosFormulario.lastName,
              middleName: datosFormulario.middleName || '',
              email: datosFormulario.email || '',
              telefono: datosFormulario.telefono || ''
            }

            this.usuario = usuarioActualizado;
            this.localStorageService.setUsuario(usuarioActualizado);

            showAlert('success', res.message);
            this.cerrarModalUsuario();
          }
        })
        .catch((err) => {
          console.error("Error al actualizar paciente", err);
          showAlert('error', 'Error al actualizar paciente');
        });
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

      this.citasRegistradas = [];
      this.citasAtendidas = [];

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].estado.toLocaleLowerCase() != "atendido") {
            this.citasRegistradas.push(data[i]);
          } else {
            this.citasAtendidas.push(data[i]);
          }
        }
      }

      this.citasAtendidas.reverse();
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
          showAlert('success', "Cita cancelada correctamente");
        }).catch((error) => {
          console.log("Error ala eliminar cita " + error);
          showAlert('error', "Error al cancelar la cita");
        })
      }
    });
  }


  verDiagnosticoYReceta(idCita: number) {
    this.urlFirma = "";
    this.citaService.verDetallesDeCitaAtendida(idCita).then((data) => {
      this.detalleCita = data;
      this.qrData = `https://xzqnmbqb-4200.brs.devtunnels.ms/verificar-receta/${this.detalleCita.idCita}`;

      this.medicoService.obtenerMedico(data.idMedico).then((medico) => {
        this.medicoService.obtenerUrlFirmaDigital(medico.urlFirmaDigital).then((url) => {
          this.urlFirma = url;
          this.mostrarModalDiagnosticoPaciente = true;
        }).catch((error) => {
          console.log("Error al obtener la url: " + JSON.stringify(error));
        });

      }).catch(() => { });

    }).catch((error) => {
      console.error("Error al obtener los detalles:", error);
    });
  }

  imprimirDetalleCita() {
    const originalTitle = document.title;
    document.title = `Receta médica - ${this.detalleCita.paciente}`;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }

  guardarPDF() {
    const element = document.querySelector('.downland') as HTMLElement;

    if (!element) return;

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      const usableWidth = pageWidth - 2 * margin;

      const ratio = usableWidth / canvas.width;
      const imgWidth = usableWidth;
      const imgHeight = canvas.height * ratio;

      const x = margin;
      const y = 20;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`Receta-medica-${this.detalleCita.paciente}.pdf`);
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

  esCitaPasada(fecha: string, hora: string): boolean {
    const ahora = new Date();
    const fechaHoraCita = new Date(`${fecha}T${hora}:00`);
    return ahora >= fechaHoraCita;
  }

  navigateVideoCall(usuarioId: number) {
    // this.router.navigate(['/videocall', usuarioId]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/videocall', usuarioId])
    );
    window.open(url, '_blank');
  }
}