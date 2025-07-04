import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { Especialidad } from '../../interface/Especialidad.interface';
import { AgendarCitaMedicaDTO } from '../../DTO/CitaMedica.DTO';
import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { MedicosPorEspecialidadDTO } from '../../DTO/MedicosPorEspecialidad.DTO';
import { HorasDispinibles } from '../../DTO/HorasDispinibles.DTO';
import {
  obtenerCamposUsuario,
  obtenerProximaFecha,
  obtenerValidacionesDeCamposUsuario,
  showAlert,
  validarEdad,
} from '../../utils/utilities';
import { CitasReservadasPorPacienteResponse } from '../../DTO/CitasReservadasPorPaciente.DTO';
import { DiaSemana } from '../../interface/DiaSemana.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import { Paciente } from '../../DTO/paciente.DTO';
import { PacienteActualizacionDTO } from '../../DTO/PacienteActualizacion.DTO';
import { PacienteService } from '../../services/paciente.service';
import { ModalEditarUsuarioComponent } from '../modal-editar-usuario/modal-editar-usuario.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { EmailService } from '../../services/email.service';
import {
  getCancelarCitaTemplaeHTML,
  getReservarCitaTemplateHTML,
} from '../../utils/template';
import Swal from 'sweetalert2';
import { DetalleCitaAtendida } from '../../DTO/DetalleCitaAtendida.DTO';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UsuarioStorage } from '../../DTO/UsuarioStorage.DTO';
// import { QRCodeComponent } from 'angularx-qrcode';
import { Router, RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { MedicoDTO } from '../../DTO/medico.DTO';
import { QRCodeModule } from 'angularx-qrcode';
import { LoadingComponent } from '../loading/loading.component';
import Hashids from 'hashids';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    ModalEditarUsuarioComponent,
    DatePipe,
    CommonModule,
    QRCodeModule,
    LoadingComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  citasService = inject(CitasService);
  especialidadService = inject(EspecialidadService);
  medicoService = inject(MedicoService);
  pacienteService = inject(PacienteService);
  emailService = inject(EmailService);
  router = inject(Router);

  vista: 'citas' | 'reservar' | 'extra' = 'citas';

  usuario: UsuarioStorage = this.localStorageService.getUsuario()!;
  idUsuario: number = this.authService.getUserId()!;

  citasRegistradas: CitasReservadasPorPacienteResponse[] = [];
  citasAtendidas: CitasReservadasPorPacienteResponse[] = [];

  especialidades$ = this.especialidadService.listarEspecialidades();
  especialidadSeleccionada?: Especialidad;
  // medicos = this.citasService.getMedicos();
  rol: string = '';
  qrData: string = '';
  urlFirma: string = '';
  medico: MedicoDTO | undefined;

  showPassword: boolean = false;
  showConfirm: boolean = false;
  isLoading = false;

  medicosFiltrados: MedicosPorEspecialidadDTO[] = [];
  fechasFiltradas: DiaSemana[] = [];
  horasFiltradas: HorasDispinibles[] = [];
  tiposDocumento = [
    { value: 1, label: 'DNI' },
    { value: 2, label: 'Carnet de Extranjería' },
    { value: 3, label: 'Pasaporte' },
  ];

  tipoCita = [
    { value: 0, label: 'Presencial' },
    { value: 1, label: 'Teleconsulta' },
  ];

  // * EDITAR PACIENTE
  modalTipo: 'paciente' | 'medico' | null = null;
  modalTitulo: string = '';
  modalCampos: any[] = [];
  modalFormGroup!: FormGroup;
  mostrarModalUsuario: boolean = false;
  especialidades: Especialidad[] = [];

  pacienteEditado: Paciente | null = null;

  medicoSeleccionado: MedicosPorEspecialidadDTO | null = null;
  diaSeleccionada: string | null = null;
  fechaCitaSeleccionada: string | null = null;
  horaSeleccionada: number | null = null;
  tipoCitaSeleccionada: number = -1;

  mostrarModalDiagnosticoPaciente: boolean = false;
  detalleCita!: DetalleCitaAtendida;

  formularioUsuario: FormGroup;
  // pacienteForm: FormGroup;

  fechaActual: Date = new Date();

  constructor(private fb: FormBuilder, private citaService: CitasService) {
    this.formularioUsuario = this.fb.group(
      {
        document_type: ['', Validators.required],
        dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        last_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
          ],
        ],
        middle_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/),
          ],
        ],
        first_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
          ],
        ],
        birth_date: ['', Validators.required],
        gender: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password_hash: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [this.passwordsMatchValidator],
      }
    );
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.listarCitasPorPaciente();

    this.especialidadService
      .listarEspecialidades()
      .then((data) => {
        this.especialidades = data.especialidades;
      })
      .catch((error) => {
        console.log('Error al listar las especialidades ' + error);
      });

    this.rol = this.authService.getUserRole() ?? '';
  }

  seleccionarEspecialidad(esp: Especialidad) {
    this.isLoading = true;
    this.especialidadSeleccionada = esp;

    this.limpiarCamposCita();
    this.medicosFiltrados = [];

    this.medicoService
      .listarMedicosPorEspecialidad(esp.id)
      .then((data) => {
        if (data.httpStatus == 200) {
          this.medicosFiltrados = data.medicos;
        }

        if (data.httpStatus == 204) {
          showAlert('error', data.mensaje);
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.medicosFiltrados = [];
        console.log(error);
      });
  }

  seleccionarMedico(medico: MedicosPorEspecialidadDTO) {
    this.isLoading = true;
    this.medicoSeleccionado = medico;

    this.limpiarCamposCita();

    this.medicoService
      .listarDiasDisponibles(medico.id!)
      .then((datos) => {
        this.fechasFiltradas = datos.diasSemana;
        this.isLoading = false;
        // this.fechasFiltradas = [];
      })
      .catch((error) => {
        this.fechasFiltradas = [];
        this.isLoading = false;
        console.log(error);
      });
  }

  seleccionarFecha(fecha: DiaSemana) {
    this.isLoading = true;
    const dia = obtenerProximaFecha(fecha.dia);
    this.fechaCitaSeleccionada = dia;

    this.diaSeleccionada = fecha.dia;
    if (this.medicoSeleccionado?.id == undefined) return;

    this.medicoService
      .listarHorasDisponibles(this.medicoSeleccionado.id, dia)
      .then((data) => {
        this.horasFiltradas = data.horas;
        this.isLoading = false;
      })
      .catch(() => {
        this.horasFiltradas = [];
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
    this.isLoading = true;
    if (
      this.especialidadSeleccionada &&
      this.medicoSeleccionado &&
      this.diaSeleccionada &&
      this.horaSeleccionada
    ) {
      var _nombreSala = '';

      if (this.tipoCitaSeleccionada == 1) {
        _nombreSala = uuidv4();
      }

      const nuevaCita: AgendarCitaMedicaDTO = {
        idMedico: this.medicoSeleccionado.id!,
        idPaciente: this.authService.getUserId() ?? 1,
        fecha: this.fechaCitaSeleccionada!,
        idHora: this.horaSeleccionada,
        estado: 1,
        tipoCita: this.tipoCitaSeleccionada,
        nombreSala: _nombreSala,
      };

      this.citaService
        .agendarCita(nuevaCita)
        .then((res) => {
          if (res.httpStatus == 201) {
            showAlert('success', res.mensaje);
            var mensaje = getReservarCitaTemplateHTML(
              this.usuario.firstName,
              this.usuario.lastName,
              nuevaCita.fecha,
              this.getHoraTexto(this.horaSeleccionada!),
              this.medicoSeleccionado?.medico!,
              '',
              this.especialidadSeleccionada?.especialidad!
            );
            this.emailService
              .message(this.usuario.email!, 'Cita médica agendada', mensaje)
              .then((value) => {})
              .catch((error) => {});

            this.medicoSeleccionado = null;
            this.diaSeleccionada = null;
            this.horaSeleccionada = null;
            this.medicosFiltrados = [];
            this.fechasFiltradas = [];
            this.horasFiltradas = [];
            this.tipoCitaSeleccionada = -1;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            showAlert('error', res.mensaje);
          }
        })
        .catch((error) => {
          this.isLoading = false;
          showAlert('error', 'Error al agendar la cita médica.');
        });
    }
  }

  abrirModalEditarPacienteDesdePerfil() {
    this.isLoading = true;
    this.authService.getPerfilUsuario().subscribe((data) => {
      console.log(data);

      const pacienteFake: Paciente = {
        idUsuario: data.usuario.id!,
        usuario: data.usuario,
      };

      this.abrirModalEditarPaciente(pacienteFake);
      this.isLoading = false;
    });
  }

  abrirModalEditarPaciente(paciente: Paciente) {
    this.modalFormGroup = this.fb.group(
      obtenerValidacionesDeCamposUsuario(paciente.usuario)
    );
    this.pacienteEditado = structuredClone(paciente);

    this.modalTipo = 'paciente';
    this.modalTitulo = 'Editar Datos';

    this.modalCampos = obtenerCamposUsuario();

    this.mostrarModalUsuario = true;
  }

  guardarCambiosUsuario(payload: { datos: any; archivo?: File }) {
    this.isLoading = true;
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
        ...datosFormulario,
      };

      this.pacienteService
        .actualizarPaciente(dto.idUsuario, dto)
        .then((res) => {
          if (res.httpStatus == 200) {
            var usuarioActualizado: UsuarioStorage = {
              // id: this.usuario.id,
              firstName: datosFormulario.firstName,
              lastName: datosFormulario.lastName,
              middleName: datosFormulario.middleName || '',
              email: datosFormulario.email || '',
              telefono: datosFormulario.telefono || '',
            };

            this.usuario = usuarioActualizado;
            this.localStorageService.setUsuario(usuarioActualizado);

            showAlert('success', res.mensaje);
            this.cerrarModalUsuario();
            this.isLoading = false;
          }
        })
        .catch((err) => {
          console.error('Error al actualizar paciente', err);
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
    this.citaService
      .listarCitasReservadasPorPaciente(this.authService.getUserId()!)
      .then((data) => {
        this.citasRegistradas = [];
        this.citasAtendidas = [];

        if (data && data.citas.length > 0) {
          for (let i = 0; i < data.citas.length; i++) {
            if (data.citas[i].estado.toLocaleLowerCase() != 'atendido') {
              this.citasRegistradas.push(data.citas[i]);
            } else {
              this.citasAtendidas.push(data.citas[i]);
            }
          }
        }

        // this.citasAtendidas.reverse();
      });
  }

  cancelarCita(idCita: number) {
    Swal.fire({
      title: '¿Estas Seguro?',
      text: 'Cancelaras la cita médica',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService
          .eliminarCitaReservado(idCita)
          .then(() => {
            this.listarCitasPorPaciente();
            var citaEncontrada = this.citasRegistradas.find(
              (c) => c.id == idCita
            );
            var formattedFecha = new Date(citaEncontrada!.fecha)
              .toISOString()
              .split('T')[0];

            var mensaje = getCancelarCitaTemplaeHTML(
              this.usuario.firstName,
              this.usuario.lastName,
              formattedFecha,
              this.getHoraTexto(citaEncontrada?.idHora!),
              citaEncontrada?.medico!,
              '',
              citaEncontrada?.especialidad!
            );
            this.emailService
              .message(this.usuario.email!, 'Cita médica cancelada', mensaje)
              .then((value) => {})
              .catch((error) => {});
            showAlert('success', 'Cita cancelada correctamente');
          })
          .catch((error) => {
            console.log('Error ala eliminar cita ' + error);
            showAlert('error', 'Error al cancelar la cita');
          });
      }
    });
  }

  verDiagnosticoYReceta(idCita: number) {
    this.isLoading = true;
    this.urlFirma = '';
    this.citaService
      .verDetallesDeCitaAtendida(idCita)
      .then((res) => {
        this.detalleCita = res.datos;
        this.qrData = `${window.location.origin}/verificar-receta/${this.detalleCita.idCita}`;
        console.log('QR Data: ', this.qrData);

        this.medicoService
          .obtenerMedico(res.datos.idMedico)
          .then((res) => {
            this.medico = res.medico;
            this.medicoService
              .obtenerUrlFirmaDigital(res.medico.urlFirmaDigital)
              .then((data) => {
                var dataSerializada = JSON.parse(data);

                this.urlFirma = dataSerializada.url;
                this.mostrarModalDiagnosticoPaciente = true;
                this.isLoading = false;
              })
              .catch((error) => {
                this.isLoading = false;
                console.log(
                  'Error al obtener la url: ' + JSON.stringify(error)
                );
              });
          })
          .catch((error) => {
            console.error('Error al obtener el médico:', error);
            this.isLoading = false;
          });
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Error al obtener los detalles:', error);
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
    this.isLoading = true;
    const element = document.querySelector('.downland') as HTMLElement;
    const firmaImg = element.querySelector('.firma') as HTMLImageElement;

    if (!element || !firmaImg) return;

    const firmaSrc = firmaImg.src;

    this.preloadImage(firmaSrc).then(() => {
      setTimeout(() => {
        html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');

          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
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
        this.isLoading = false;
      }, 100);
    });
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
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

  navigateVideoCall(usuarioId: number, roomId: string) {
    // this.router.navigate(['/videocall', usuarioId]);
    const hashids = new Hashids();
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/videocall',
        hashids.encode(usuarioId),
        roomId,
      ])
    );
    window.open(url, '_blank');
  }

  limpiarCamposCita() {
    this.fechasFiltradas = [];
    this.horasFiltradas = [];
    this.diaSeleccionada = null;
    this.horaSeleccionada = null;
    this.tipoCitaSeleccionada = -1;
  }
}
