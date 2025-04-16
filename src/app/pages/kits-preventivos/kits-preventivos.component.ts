import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-kits-preventivos',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './kits-preventivos.component.html',
  styleUrl: './kits-preventivos.component.css'
})
export class KitsPreventivosComponent {
  kits = [
    {
      "titulo": "Evaluación de Capacidad y Función Pulmonar",
      "imagen": "../../../assets/img/kits-preventivos/Espriometria_v2.jpg",
      "precio": "S/ 479",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "Evaluación Médica: Control de funciones vitales, signos y síntomas respiratorios",
        "Análisis Laboratorial: Hemograma completo, BK con esputo, Examen directo en esputo, Prueba de antígeno Covid 19",
        "Test Espirometría"
      ]
    },
    {
      "titulo": "MAPA Cardiológico",
      "imagen": "../../../assets/img/kits-preventivos/MAPA_v2-480x480.jpg",
      "precio": "S/ 447",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "Monitoreo de presión arterial por 24 horas",
        "Confirmamos el diagnóstico de hipertensión con valores limítrofes o cambiantes",
        "Se puede ajustar al tratamiento antihipertensivo",
        "Reportamos fluctuaciones más importantes de la presión arterial a lo largo del día"
      ]
    },
    {
      "titulo": "Holter Cardíaco",
      "imagen": "../../../assets/img/kits-preventivos/HOLTER_v2-480x480.jpg",
      "precio": "S/ 670",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "Monitorización electrocardiográfica (Holter)",
        "Confirmamos el diagnostico de alteraciones y trastornos del funcionamiento del corazón",
        "Interpretación Médica Digital"
      ]
    },
    {
      "titulo": "EKG + Holter",
      "imagen": "../../../assets/img/kits-preventivos/EKGHOLTER_v2-480x480.jpg",
      "precio": "S/ 797",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "En este Kit te ofrecemos la Monitorización Electrocardiográfica (Holter) y el Electrocardiograma (EKG)"
      ]
    },
    {
      "titulo": "EKG + MAPA",
      "imagen": "../../../assets/img/kits-preventivos/EKGMAPA_v2-480x480.jpg",
      "precio": "S/ 597",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "En este Kit te ofrecemos Electrocardiograma (EKG) y Monitoreo Ambulatorio de Presión Arterial (MAPA)"
      ]
    },
    {
      "titulo": "Equipo Médico Preventivo 1",
      "imagen": "../../../assets/img/kits-preventivos/Kits-Medico-1-480x480.jpg",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "Tensiómetro digital",
        "Pulsímetro",
        "Termómetro"
      ]
    },
    {
      "titulo": "Equipo Médico Preventivo 2",
      "imagen": "../../../assets/img/kits-preventivos/Kits-Medico-2-480x480.jpg",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "Balanza",
        "Glucómetro",
        "Pulsímetro",
        "Tensiómetro digital",
        "Termómetro"
      ]
    },
    {
      "titulo": "Niño Saludable",
      "imagen": "../../../assets/img/kits-preventivos/Nino-480x480.jpg",
      "precio": "S/ 197",
      "descuento": "Kit 15% Dcto",
      "incluye": [
        "Hemograma Completo",
        "Análisis de Orina Completo",
        "Creatinina Sérica",
        "Análisis TGO y TGP",
        "Parasitológico Simple",
        "Atención Médica y Seguimiento del Paciente"
      ]
    }
  ]

}
