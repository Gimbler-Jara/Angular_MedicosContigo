import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private userID = 'OpYX7cr-YjuGj7sy9';

  // web
  private webServiceID = 'service_falit99';
  private webTemplateID = 'template_7r9la47';

  //contactanos
  private contactanosServiceID = 'service_70ak18j';
  private contactanosTemplateID = 'template_gkd6hmr';

  constructor() { }

  message(email: string, subject: string, message: string): Promise<EmailJSResponseStatus> {
    return new Promise<EmailJSResponseStatus>((resolve, reject) => {
      // const templateParams = { email: email, subject, message };

      // emailjs.send(this.webServiceID, this.webTemplateID, templateParams, this.userID).then((value: EmailJSResponseStatus) => {
      //   resolve(value);
      // });
    });
  }

  contactanos(data: { nombre: string, correo: string, telefono: number, mensaje: string }) {
    return new Promise<EmailJSResponseStatus>((resolve, reject) => {
      //   var params = {
      //     name: data.nombre,
      //     email: data.correo,
      //     cellphone: data.telefono,
      //     message: data.mensaje
      //   }
      //   emailjs.send(this.contactanosServiceID, this.contactanosTemplateID, params, this.userID).then((value: EmailJSResponseStatus) => {
      //     resolve(value);
      //   });
    });
  }
}
