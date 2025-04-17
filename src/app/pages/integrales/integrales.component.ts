import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-integrales',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './integrales.component.html',
  styleUrl: './integrales.component.css'
})
export class IntegralesComponent {
  serviciosIntegrales = [
    {
      titulo: 'Odontología a Domicilio',
      descripcion: 'Te presentamos nuestro servicio de dentista a domicilio con los principales tratamientos odontológicos en tu propio hogar.',
      imagen: 'assets/img/integrales/Odontologia.jpg',
      alt: 'Odontología a Domicilio',
      link: '#'
    },
    {
      titulo: 'Fisioterapia y Rehabilitación Física',
      descripcion: 'Te presentamos el Servicio especializado de Fisioterapia y Rehabilitación A DOMICILIO.',
      imagen: 'assets/img/integrales/Fisioterapia.jpg',
      alt: 'Fisioterapia y Rehabilitación Física',
      link: '#'
    },
    {
      titulo: 'Obstetricia a Domicilio',
      descripcion: 'Te ayudamos en tu embarazo, el nacimiento y el puerperio o posparto (de la salud de la madre en los 40 días posteriores al parto)',
      imagen: 'assets/img/integrales/Obstetricia.jpg',
      alt: 'Obstetricia a Domicilio',
      link: '#'
    },
    {
      titulo: 'Nutrición',
      descripcion: 'Servicio especializado en nutrición integral con trato personalizado, para un sano crecimiento',
      imagen: 'assets/img/integrales/Nutricion-480x480.jpg',
      alt: 'Nutrición',
      link: '#'
    },
    {
      titulo: 'Optometría a Domicilio',
      descripcion: 'Te ofrecemos el servicio de Optometría a Domicilio, realizamos análisis visuales para detectar anomalías presentes.',
      imagen: 'assets/img/integrales/Optometria.jpg',
      alt: 'Optometría a Domicilio',
      link: '#'
    },
    {
      titulo: 'Psicología',
      descripcion: 'Para todos las edades, cuidando de los problemas de comportamiento en el confort de tu hogar',
      imagen: 'assets/img/integrales/Psicologia-480x480.jpg',
      alt: 'Psicología',
      link: '#'
    },
    {
      titulo: 'SEHIPACA',
      descripcion: 'Servicio de Higiene y Cuidado Personal al Paciente en casa, sin largas esperas y en tu propio hogar.',
      imagen: 'assets/img/integrales/SEHIPACA-500-copia-480x480.jpg',
      alt: 'SEHIPACA',
      link: '#'
    },
    {
      titulo: 'CIMEDOM',
      descripcion: 'Contamos con profesionales capacitados para tratar y curar cualquier patología que tengas, con calidez y precisión.',
      imagen: 'assets/img/integrales/CIMEDOM-500-copia-480x480.jpg',
      alt: 'CIMEDOM',
      link: '#'
    },
    {
      titulo: 'SAMEREDO',
      descripcion: 'Servicio de Salud Médica Respiratoria a domicilio, brindando tratamiento a tu sistema respiratorio completo.',
      imagen: 'assets/img/integrales/SAMEDERO-500-copia-480x480.jpg',
      alt: 'SAMEREDO',
      link: '#'
    },
    {
      titulo: 'P-Health',
      descripcion: 'Brinda atención médica al paciente extranjero en Lima y todo el Perú, las 24 horas del día, todos los días del año.',
      imagen: 'assets/img/integrales/P-HEALTH-500-copia-480x480.jpg',
      alt: 'P-Health',
      link: '#'
    }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0); 
  }
}
