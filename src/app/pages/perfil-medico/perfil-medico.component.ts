import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil-medico.component.html',
  styleUrl: './perfil-medico.component.css'
})
export class PerfilMedicoComponent {
  vista: string = 'citas';

  citasProgramadas = [
    { fecha: '2025-04-15', hora: '09:00 AM', paciente: 'Ana López', estado: 'pendiente' },
    { fecha: '2025-04-16', hora: '10:00 AM', paciente: 'Luis Ramírez', estado: 'atendida' },
    { fecha: '2025-04-17', hora: '11:00 AM', paciente: 'Carlos Díaz', estado: 'cancelada' },
  ];
  citasFiltradas = [...this.citasProgramadas];

  disponibilidades = [
    { dia: 'Lunes', hora: '08:00 AM' },
    { dia: 'Martes', hora: '10:00 AM' }
  ];

  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  filtroDia = '';
  horas = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

  nuevaDisponibilidad = { dia: '', hora: '' };

  ngOnInit(): void {
    this.citasProgramadas.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
  }

  agregarDisponibilidad() {
    if (this.nuevaDisponibilidad.dia && this.nuevaDisponibilidad.hora) {
      this.disponibilidades.push({ ...this.nuevaDisponibilidad });
      this.nuevaDisponibilidad = { dia: '', hora: '' };
    }
  }

  eliminarDisponibilidad(dispo: any) {
    this.disponibilidades = this.disponibilidades.filter(d => d !== dispo);
  }

  filtrarCitasPorDia() {
    if (!this.filtroDia) {
      this.citasFiltradas = this.citasProgramadas;
      return;
    }

    this.citasFiltradas = this.citasProgramadas.filter(cita =>
      new Date(cita.fecha).toLocaleDateString('es-PE', { weekday: 'long' }).toLowerCase() === this.filtroDia.toLowerCase()
    );
  }
}
