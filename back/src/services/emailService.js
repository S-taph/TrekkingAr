/**
 * Email Service
 * 
 * Servicio para envío de emails usando Nodemailer con Gmail SMTP.
 * Incluye plantillas para notificaciones de contacto y respuestas.
 */

import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_SMTP_USER,
          pass: process.env.GMAIL_SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verificar configuración
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Error configurando email service:', error);
        } else {
          console.log('Email service configurado correctamente');
        }
      });
    } catch (error) {
      console.error('Error inicializando email service:', error);
    }
  }

  /**
   * Envía email de notificación a administradores sobre nuevo mensaje de contacto
   */
  async sendContactNotificationToAdmins(contactData) {
    if (!this.transporter) {
      throw new Error('Email service no configurado');
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    
    if (adminEmails.length === 0) {
      console.warn('No hay emails de administradores configurados');
      return;
    }

    const mailOptions = {
      from: process.env.GMAIL_SMTP_USER,
      to: adminEmails.join(', '),
      subject: `Nuevo mensaje de contacto: ${contactData.asunto}`,
      html: this.getContactNotificationTemplate(contactData)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email de notificación enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error enviando email de notificación:', error);
      throw error;
    }
  }

  /**
   * Envía copia de confirmación al usuario que envió el mensaje de contacto
   */
  async sendContactConfirmationToUser(contactData) {
    if (!this.transporter) {
      throw new Error('Email service no configurado');
    }

    const mailOptions = {
      from: process.env.GMAIL_SMTP_USER,
      to: contactData.email,
      subject: `Confirmación de consulta recibida: ${contactData.asunto}`,
      html: this.getContactConfirmationTemplate(contactData)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email de confirmación enviado al usuario:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error enviando email de confirmación al usuario:', error);
      throw error;
    }
  }

  /**
   * Envía respuesta del administrador al usuario que envió el mensaje de contacto
   */
  async sendContactReplyToUser(contactData, reply, adminName) {
    if (!this.transporter) {
      throw new Error('Email service no configurado');
    }

    const mailOptions = {
      from: process.env.GMAIL_SMTP_USER,
      to: contactData.email,
      subject: `Re: ${contactData.asunto}`,
      html: this.getContactReplyTemplate(contactData, reply, adminName)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email de respuesta enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error enviando email de respuesta:', error);
      throw error;
    }
  }

  /**
   * Envía email de verificación de cuenta
   */
  async sendVerificationEmail(email, token, nombre) {
    if (!this.transporter) {
      throw new Error('Email service no configurado');
    }

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.GMAIL_SMTP_USER,
      to: email,
      subject: 'Verifica tu correo electrónico - TrekkingAR',
      html: this.getVerificationEmailTemplate(nombre, verificationUrl)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email de verificación enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      throw error;
    }
  }

  /**
   * Envía email de notificación del sistema
   */
  async sendSystemNotification(notificationData) {
    if (!this.transporter) {
      throw new Error('Email service no configurado');
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    
    if (adminEmails.length === 0) {
      console.warn('No hay emails de administradores configurados');
      return;
    }

    const mailOptions = {
      from: process.env.GMAIL_SMTP_USER,
      to: adminEmails.join(', '),
      subject: `Notificación del sistema: ${notificationData.titulo}`,
      html: this.getSystemNotificationTemplate(notificationData)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email de notificación del sistema enviado:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error enviando email de notificación del sistema:', error);
      throw error;
    }
  }

  /**
   * Plantilla HTML para notificación de contacto
   */
  getContactNotificationTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo mensaje de contacto</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1E7A5F; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1E7A5F; }
          .value { margin-top: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo mensaje de contacto</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div class="value">${contactData.nombre}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${contactData.email}</div>
            </div>
            <div class="field">
              <div class="label">Asunto:</div>
              <div class="value">${contactData.asunto}</div>
            </div>
            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value">${contactData.mensaje.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">Fecha:</div>
              <div class="value">${new Date(contactData.createdAt).toLocaleString('es-AR')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de TrekkingApp.</p>
            <p>Puedes responder desde el panel de administración.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para confirmación de mensaje recibido
   */
  getContactConfirmationTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de consulta recibida</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1E7A5F; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .message-box { background-color: #e9f5f0; padding: 15px; margin: 20px 0; border-left: 4px solid #1E7A5F; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { color: #1E7A5F; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Consulta recibida!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${contactData.nombre}</strong>,</p>

            <p>Hemos recibido tu consulta y queremos confirmar que la hemos registrado correctamente. Nuestro equipo la revisará y te responderá a la brevedad.</p>

            <div class="message-box">
              <h3>Resumen de tu consulta:</h3>
              <p><strong>Asunto:</strong> ${contactData.asunto}</p>
              <p><strong>Tu email:</strong> ${contactData.email}</p>
              <p><strong>Mensaje:</strong></p>
              <p>${contactData.mensaje.replace(/\n/g, '<br>')}</p>
              <p><strong>Fecha de envío:</strong> ${new Date(contactData.createdAt).toLocaleString('es-AR')}</p>
            </div>

            <p>Te responderemos lo antes posible a <span class="highlight">${contactData.email}</span>.</p>

            <p>Si tienes alguna pregunta adicional mientras tanto, no dudes en contactarnos.</p>

            <p>Saludos cordiales,<br>
            <strong>Equipo TrekkingAR</strong></p>
          </div>
          <div class="footer">
            <p>Este es un email automático de confirmación.</p>
            <p>TrekkingAR - San Carlos de Bariloche, Río Negro, Argentina</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para respuesta de contacto
   */
  getContactReplyTemplate(contactData, reply, adminName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Respuesta a tu consulta</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1E7A5F; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .original-message { background-color: #e9e9e9; padding: 15px; margin: 20px 0; border-left: 4px solid #1E7A5F; }
          .reply { background-color: #f0f8f0; padding: 15px; margin: 20px 0; border-left: 4px solid #D98B3A; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Respuesta a tu consulta</h1>
          </div>
          <div class="content">
            <p>Hola ${contactData.nombre},</p>
            
            <div class="original-message">
              <h3>Tu consulta original:</h3>
              <p><strong>Asunto:</strong> ${contactData.asunto}</p>
              <p><strong>Mensaje:</strong></p>
              <p>${contactData.mensaje.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="reply">
              <h3>Nuestra respuesta:</h3>
              <p>${reply.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>Si tienes más preguntas, no dudes en contactarnos nuevamente.</p>
            
            <p>Saludos cordiales,<br>
            <strong>${adminName}</strong><br>
            Equipo TrekkingApp</p>
          </div>
          <div class="footer">
            <p>Este email fue enviado como respuesta a tu consulta del ${new Date(contactData.createdAt).toLocaleDateString('es-AR')}.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para email de verificación
   */
  getVerificationEmailTemplate(nombre, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1E7A5F; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 15px 40px; background-color: #D98B3A; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .button:hover { background-color: #c47a2f; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .url-box { background-color: #f0f8f0; padding: 15px; border-left: 4px solid #1E7A5F; margin: 20px 0; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏔️ TrekkingAR</h1>
            <p style="margin: 0; font-size: 18px;">Bienvenido a la aventura</p>
          </div>
          <div class="content">
            <h2>¡Hola, ${nombre}!</h2>
            <p>Gracias por registrarte en TrekkingAR. Estamos emocionados de tenerte con nosotros.</p>
            <p>Para completar tu registro y comenzar tu aventura, por favor verifica tu correo electrónico haciendo clic en el botón de abajo:</p>

            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">✓ Verificar mi correo</a>
            </div>

            <p>O copia y pega este enlace en tu navegador:</p>
            <div class="url-box">
              <code>${verificationUrl}</code>
            </div>

            <p><strong>⚠️ Este enlace expirará en 24 horas.</strong></p>
            <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>

            <p style="margin-top: 30px;">¡Nos vemos en la montaña! 🥾</p>
            <p><strong>El equipo de TrekkingAR</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TrekkingAR - San Carlos de Bariloche, Río Negro, Argentina</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Plantilla HTML para notificaciones del sistema
   */
  getSystemNotificationTemplate(notificationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notificación del sistema</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C6EA4; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .priority { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .priority.alta { background-color: #ffebee; border-left: 4px solid #f44336; }
          .priority.urgente { background-color: #ffcdd2; border-left: 4px solid #d32f2f; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Notificación del sistema</h1>
          </div>
          <div class="content">
            <div class="priority ${notificationData.prioridad}">
              <strong>Prioridad:</strong> ${notificationData.prioridad.toUpperCase()}
            </div>
            
            <h2>${notificationData.titulo}</h2>
            <p>${notificationData.mensaje}</p>
            
            ${notificationData.meta ? `
              <h3>Información adicional:</h3>
              <pre>${JSON.stringify(notificationData.meta, null, 2)}</pre>
            ` : ''}
            
            <p><strong>Fecha:</strong> ${new Date(notificationData.createdAt).toLocaleString('es-AR')}</p>
          </div>
          <div class="footer">
            <p>Esta es una notificación automática del sistema TrekkingApp.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Exportar instancia singleton
export default new EmailService();
