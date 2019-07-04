import * as nodemailer from 'nodemailer';
import * as config from 'config';
import { Transporter } from 'nodemailer';

interface EmailOptions {
  from: string;
  service: string;
  auth: {
    user: string;
    pass: string
  };
}

const emailOptions = config.get<EmailOptions>('connections.email');

class EmailNotificator {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: emailOptions.service,
      auth: emailOptions.auth,
    });
  }

  async sendEmail(to: string[], taskId: number) {
    const mailOptions = {
      from: emailOptions.from,
      to: to.join(', '),
      subject: 'Your task has been changed',
      text: `Task with id ${taskId} has been changed!`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(info.response);
    } catch (e) {
      console.error(e);
    }
  }
}

export const emailNotificator = new EmailNotificator();
