export function getRegisterTemplateHTML(nombre: string, apellido: string, correo: string, pass: string) {
    var message = `
    <table width="100%" cellpadding="0" cellspacing="0"
    style="font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #f5f5f5;  padding: 30px 0;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="background-color: #009BDE; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="padding: 20px;">
                        <!-- Encabezado -->
                        <h1 style="color: #fcee02; font-size: 24px; margin: 0 0 50px; text-align: center;">
                            ¡Bienvenido a Médicos Contigo!
                        </h1>
                        <!-- Saludo -->
                        <p style="margin: 0 0 10px; color:#ffffff;">Hola <strong>${nombre} ${apellido}</strong>,</p>
                        <p style="margin: 0 0 40px; color:#ffffff;">Gracias por crear una cuenta.</p>
                        <!-- Datos de acceso -->
                        <p style="margin: 0 0 10px; color:#ffffff;"><strong>Tus datos de acceso son:</strong></p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                            <tr>
                                <td
                                    style="padding: 10px; background-color: #dbdbdb; width: 200px; border-radius: 20px 0px 0px 0px;">
                                    <strong>Correo electrónico:</strong>
                                </td>
                                <td style="padding: 10px; background-color: #dbdbdb;  border-radius: 0px 20px 0px 0px;">
                                    <a href="mailto:${correo}"
                                        style="color: #039AD4; text-decoration: none;">
                                        ${correo}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="padding: 10px;  background-color: #dbdbdb;  width: 200px; border-radius: 0px 0px 0 20px;">
                                    <strong>Contraseña:</strong>
                                </td>
                                <td style="padding: 10px;  background-color: #dbdbdb; border-radius: 0px 0px 20px 0px;">
                                    ${pass}
                                </td>
                            </tr>
                        </table>
                        <!-- Despedida -->
                        <p style="margin: 0; color:#ffffff;">Saludos,</p>
                        <p style="margin: 0; color:#ffffff;">El equipo de Médicos Contigo.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
    `
    return message;
}


export function getReservarCitaTemplateHTML(nombrePaciente: string, apellidoPaciente: string, fecha: string, hora: string, nombreDoctor: string, apellidoDoctor: string, especialidad: string) {
    var message = `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #f5f5f5; padding: 30px 0;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="background-color: #009BDE; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="padding: 20px;">
                        <!-- Encabezado -->
                        <h1 style="color: #fcee02; font-size: 24px; margin: 0 0 50px; text-align: center;">
                            ¡Cita Médica Reservada!
                        </h1>
                        <!-- Saludo -->
                        <p style="margin: 0 0 10px; color: #ffffff;">
                            Hola <strong>${nombrePaciente} ${apellidoPaciente}</strong>,
                        </p>
                        <!-- Texto de confirmación -->
                        <p style="margin: 0 0 40px; color: #ffffff;">
                            Has reservado una cita médica con la siguiente información:
                        </p>
                        <!-- Detalles de la cita -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                            <tr>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; width: 200px; border-radius: 20px 0 0 0;  ">
                                    <strong>Fecha:</strong>
                                </td>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; border-radius: 0 20px 0 0; color: rgb(5, 124, 5);">
                                    ${fecha}
                                </td>
                            </tr>
                             <tr>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; width: 200px;  ">
                                    <strong>Hora:</strong>
                                </td>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; color: rgb(5, 124, 5);">
                                    ${hora}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background-color: #e0e0e0; width: 200px;">
                                    <strong>Doctor:</strong>
                                </td>
                                <td style="padding: 10px; background-color: #e0e0e0; color: rgb(5, 124, 5);">
                                   ${nombreDoctor} ${apellidoDoctor}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; width: 200px; border-radius: 0 0 0 20px;">
                                    <strong>Especialidad:</strong>
                                </td>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; border-radius: 0 0 20px 0; color: rgb(5, 124, 5);">
                                    ${especialidad}
                                </td>
                            </tr>
                        </table>
                        <!-- Despedida -->
                        <p style="margin: 0; color: #ffffff;">Saludos,</p>
                        <p style="margin: 0; color: #ffffff;">El equipo de Médicos Contigo</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

  `

    return message;
}



export function getCancelarCitaTemplaeHTML(nombrePaciente: string, apellidoPaciente: string, fecha: string, hora: string, nombreDoctor: string, apellidoDoctor: string, especialidad: string) {
    var message = `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #f5f5f5; padding: 30px 0;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="background-color: #009BDE; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="padding: 20px;">
                        <!-- Encabezado -->
                        <h1 style="color: #fcee02; font-size: 24px; margin: 0 0 50px; text-align: center;">
                            ¡Cita Médica Cancelada!
                        </h1>
                        <!-- Saludo -->
                        <p style="margin: 0 0 10px; color: #ffffff;">
                            Hola <strong>${nombrePaciente} ${apellidoPaciente}</strong>,
                        </p>
                        <!-- Texto de confirmación -->
                        <p style="margin: 0 0 40px; color: #ffffff;">
                            Has cancelado una cita médica con la siguiente información:
                        </p>
                        <!-- Detalles de la cita -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                            <tr>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; width: 200px; border-radius: 20px 0 0 0;  ">
                                    <strong>Fecha:</strong>
                                </td>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; border-radius: 0 20px 0 0; color:  rgb(124, 5, 5);">
                                    ${fecha}
                                </td>
                            </tr>
                             <tr>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; width: 200px;  ">
                                    <strong>Hora:</strong>
                                </td>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; color: rgb(124, 5, 5);">
                                    ${hora}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background-color: #e0e0e0; width: 200px;">
                                    <strong>Doctor:</strong>
                                </td>
                                <td style="padding: 10px; background-color: #e0e0e0; color:  rgb(124, 5, 5);">
                                   ${nombreDoctor} ${apellidoDoctor}
                                </td>
                            </tr>
                            <tr>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; width: 200px; border-radius: 0 0 0 20px;">
                                    <strong>Especialidad:</strong>
                                </td>
                                <td
                                    style="padding: 10px; background-color: #e0e0e0; border-radius: 0 0 20px 0; color: rgb(124, 5, 5);">
                                    ${especialidad}
                                </td>
                            </tr>
                        </table>
                        <!-- Despedida -->
                        <p style="margin: 0; color: #ffffff;">Saludos,</p>
                        <p style="margin: 0; color: #ffffff;">El equipo de Médicos Contigo</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

  `

    return message;
}
 