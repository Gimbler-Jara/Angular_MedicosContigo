import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-generales',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './generales.component.html',
  styleUrl: './generales.component.css'
})
export class GeneralesComponent {
  serviciosGenerales = [
    {
      titulo: 'Atención Primaria y Urgencias',
      descripcion: 'Porque nuestros pacientes son primero, te brindamos atención personalizada y en tu hogar.',
      imagen: 'assets/img/generales/Consulta-Programada.jpg',
      alt: 'Atención Primaria',
      link: '#'
    },
    {
      titulo: 'Análisis Laboratoriales',
      descripcion: 'Realizamos todo tipo de análisis clínico. Nuestras licenciadas en enfermería le realizarán la toma desde la comodidad de tu hogar.',
      imagen: 'assets/img/generales/Analisis-Clinicos_v2.jpg',
      alt: 'Análisis Laboratoriales',
      link: '#'
    },
    {
      titulo: 'Imágenes Auxiliares',
      descripcion: 'Radiografía, Ecografía en el confort de tu hogar',
      imagen: 'assets/img/generales/Imagenes-Auxiliares.jpg',
      alt: 'Imágenes Auxiliares',
      link: '#'
    },
    {
      titulo: 'TeleConsulta en Medicina General',
      descripcion: 'Nuestros médicos y enfermeros de TeleConsulta estarán gustosos en ayudarte.',
      imagen: 'assets/img/generales/TeleConsulta.jpg',
      alt: 'TeleConsulta',
      link: '#'
    },
    {
      titulo: 'Servicio de Enfermería',
      descripcion: 'Atención a personas con necesidad de atención permanente o en estado terminal.',
      imagen: 'assets/img/generales/Enfermeras-480x480.jpg',
      alt: 'Enfermería',
      link: '#'
    },
    {
      titulo: 'Procedimientos Menores',
      descripcion: 'Suturas de heridas, Curaciones, Sueros, Inyectables, entre otros procedimientos.',
      imagen: 'assets/img/generales/Procedimientos.jpg',
      alt: 'Procedimientos Menores',
      link: '#'
    },
    {
      titulo: 'Hospital en Casa',
      descripcion: 'Cuida a tus seres queridos en casa con un equipo hospitalario a domicilio para una recuperación cómoda.',
      imagen: 'assets/img/generales/Hospital-en-Casa.jpg',
      alt: 'Hospital en Casa',
      link: '#'
    }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0); 
  }
}
