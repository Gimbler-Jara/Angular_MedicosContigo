import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-packs-preventivos',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './packs-preventivos.component.html',
  styleUrl: './packs-preventivos.component.css'
})
export class PacksPreventivosComponent {


  planes = [
    {
      "titulo": "Mujer Joven Saludable",
      "imagen": "assets/img/packs-preventivos/Mujer-480x480.jpg",
      "precio": "S/ 337",
      "servicios": [
        "Ecografía mama/pélvica o electrocardiograma (acorde a edad y riesgo)",
        "Toma de PAP (papanicolau)",
        "Hemograma Completo",
        "Glucosa Basal",
        "Perfil Hepático",
        "Perfil Lipídico",
        "Urea y Creatinina en sangre",
        "Examen Completo de Orina",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Hombre Saludable",
      "imagen": "assets/img/packs-preventivos/Hombre-480x480.jpg",
      "precio": "S/ 337",
      "servicios": [
        "Hemograma completo",
        "Glucosa basal",
        "Examen completo de orina",
        "Perfil hepático",
        "Urea y Creatinina en sangre",
        "PSA total (descartar cáncer de próstata)",
        "Ecografía de vejiga, renal y próstata",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Mujer Fértil Saludable",
      "imagen": "assets/img/packs-preventivos/Mujer-fertil-480x480.jpg",
      "precio": "S/ 497",
      "servicios": [
        "Ecografía mama/pélvica",
        "Toma de PAP (Papanicolau)",
        "Hemograma Completo",
        "Glucosa Basal",
        "Perfil Hepático",
        "Perfil Lipídico",
        "Urea y Creatinina en Sangre",
        "Examen Completo de Orina",
        "Hormona Foliculo estimulante (FSH)",
        "Hormona Estimulante de la Tiroides (TSH)",
        "Estradiol",
        "Hormona Luteinizante (LH)",
        "Progesterona",
        "Prolactina",
        "Hormona Antimulleriana (AMH)",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Hombre Fértil Saludable",
      "imagen": "assets/img/packs-preventivos/Hombre-Fertil-480x480.jpg",
      "precio": "S/ 577",
      "servicios": [
        "Hemograma Completo",
        "Perfil Renal",
        "Glucosa Basal",
        "Perfil Lipídico",
        "Testosterona total y libre",
        "Espermograma",
        "Espermocultivo",
        "Orina Completa",
        "Urocultivo",
        "Ecografía de vejiga y próstata",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Mujer en Climaterio y Menopausia",
      "imagen": "assets/img/packs-preventivos/Climaterio-480x480.jpg",
      "precio": "S/ 377",
      "servicios": [
        "Ecografía mama/pélvica o electrocardiograma",
        "Toma de PAP (papanicolau)",
        "Hemograma Completo",
        "Glucosa Basal",
        "Perfil Lipídico",
        "Urea y Creatinina en Sangre",
        "Examen Completo de Orina",
        "Hormona Foliculo Estimulante (FSH)",
        "Hormona Estimulante de la Tiroides (TSH)",
        "Estradiol",
        "Hormona Luteinizante (LH)",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Suplementos Rejuvenecer Humano",
      "imagen": "assets/img/packs-preventivos/Rejuvenecedor-480x480.jpg",
      "precio": "S/ 387",
      "servicios": [
        "Vitamina C",
        "Complejo Vitamina B",
        "Aminoácidos",
        "Vía periférica de un solo uso",
        "Vigilancia de funciones vitales",
        "TEST de evaluación previa a tu aplicación de suplemento endovenoso",
        "Todo en el confort de tu hogar"
      ]
    },
    {
      "titulo": "Adulto Mayor Saludable",
      "imagen": "assets/img/packs-preventivos/Adulto-480x480.jpg",
      "precio": "S/ 293",
      "servicios": [
        "Hemograma completo",
        "Glucosa basal",
        "Examen completo de orina",
        "Perfil hepático",
        "Urea y Creatinina en Sangre",
        "Electrocardiograma",
        "Colesterol, Triglicéridos",
        "Prueba de Esputo Simple",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Riñón Saludable",
      "imagen": "assets/img/packs-preventivos/Rinon_v2-480x480.jpg",
      "precio": "S/ 314",
      "servicios": [
        "Hemograma completo",
        "Examen completo de orina",
        "Urea y Creatinina en Sangre",
        "Depuración de creatinina",
        "Ecografía de ambos riñones",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Niño Saludable",
      "imagen": "assets/img/packs-preventivos/Ninos-480x480.jpg",
      "precio": "S/ 244",
      "servicios": [
        "Hemograma completo",
        "Perfil hepático",
        "Urea y Creatinina en sangre",
        "Examen Completo de Orina",
        "Parasitológico simple x1",
        "Prueba de esputo x1",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Tiroides Saludable",
      "imagen": "assets/img/packs-preventivos/Tiroides-480x480.jpg",
      "precio": "S/ 314",
      "servicios": [
        "Hemograma completo",
        "Hormonas T3 – T4 – TSH",
        "Ecografía de cuello – tiroides (partes blandas)",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Reumatológico Saludable",
      "imagen": "assets/img/packs-preventivos/Reumatologico-480x480.jpg",
      "precio": "S/ 314",
      "servicios": [
        "Hemograma completo",
        "VSG (descarte infeccioso – inflamatorio)",
        "Ecografía de partes blandas (Hombros o rodillas o muñecas)",
        "Factor reumatoideo (descarte de artritis reumatoidea)",
        "Ácido úrico (descarte de Gota)",
        "ANA (descarte de Lupus)",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Pulmones Saludables",
      "imagen": "assets/img/packs-preventivos/Pulmones-480x480.jpg",
      "precio": "S/ 594",
      "servicios": [
        "Hemograma completo",
        "Descarte de tuberculosis (BK esputo)",
        "Espirometría Digital",
        "Radiografía de tórax (anterior – posterior)",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Gestante Saludable",
      "imagen": "assets/img/packs-preventivos/Embarazo-480x480.jpg",
      "precio": "S/ 377",
      "servicios": [
        "Ecografía Obstétrica o Transvaginal",
        "Hemograma Completo",
        "Glucosa Basal",
        "Perfil Hepático",
        "Perfil Lipídico",
        "Cortisol Sérico",
        "Urea y Creatinina en Sangre",
        "Examen Completo de Orina",
        "Hormona Estimulante de la Tiroides (TSH)",
        "Estradiol",
        "Progesterona",
        "Prolactina",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Corazón Saludable",
      "imagen": "assets/img/packs-preventivos/Corazon-480x480.jpg",
      "precio": "S/ 314",
      "servicios": [
        "Hemograma completo",
        "Perfil lipídico",
        "Electrocardiograma (EKG)",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Abdomen Saludable",
      "imagen": "assets/img/packs-preventivos/Abdomen-480x480.jpg",
      "precio": "S/ 314",
      "servicios": [
        "Hemograma completo",
        "Perfil hepático",
        "Urea y Creatinina en Sangre",
        "Ecografía abdominal completa",
        "Consulta médica y seguimiento del paciente"
      ]
    },
    {
      "titulo": "Salud Dental",
      "imagen": "assets/img/packs-preventivos/Dental-480x480.jpg",
      "precio": "Desde S/ 314",
      "servicios": [
        "Pack para Bebes",
        "Pack Pre Escolar",
        "Pack Escolar",
        "Pack Salud Oral en Gestantes",
        "Pack Odonto Geriatría",
        "Todos con un Kit de Regalo"
      ]
    }
  ]

}
