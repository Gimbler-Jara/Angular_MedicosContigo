import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
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
import { DetalleCitaAtendidaDTO } from '../../DTO/DetalleCitaAtendida.interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UsuarioStorage } from '../../DTO/UsuarioStorage.interface';
import { QRCodeComponent } from 'angularx-qrcode';



@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, ModalEditarUsuarioComponent, DatePipe, CommonModule, QRCodeComponent],
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
    this.authService.getPerfilUsuario().subscribe(usuario => {
      const pacienteFake: PacienteDTO = {
        idUsuario: usuario.id!,
        usuario: usuario
      };

      this.abrirModalEditarPaciente(pacienteFake);
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


  guardarCambiosUsuario() {
    if (this.modalTipo === 'paciente' && this.pacienteEditado) {
      const dto: PacienteActualizacionDTO = {
        idUsuario: this.pacienteEditado.idUsuario,
        ...this.modalFormGroup.value
      };

      this.pacienteService.actualizarPaciente(dto.idUsuario, dto)
        .then(res => {
          if (res.success) {
            this.usuario.middleName = dto.middleName;
            this.usuario.firstName = dto.firstName;
            this.usuario.lastName = dto.lastName;
            this.usuario.telefono = dto.telefono;

            var u: UsuarioStorage = {
              id: this.usuario.id,
              firstName: this.usuario.firstName,
              lastName: this.usuario.lastName,
              middleName: this.usuario.middleName!,
              email: this.usuario.email!,
              telefono: this.usuario.telefono!
            }
            this.localStorageService.setUsuario(u);
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
          this.showAlert('success', "Cita cancelada correctamente");
        }).catch((error) => {
          console.log("Error ala eliminar cita " + error);
          this.showAlert('error', "Error al cancelar la cita");
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