import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendBookingConfirmation(email: string, flightDetails: any) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Flight Booking Confirmation',
      text: `Your flight from ${flightDetails.source} to ${flightDetails.destination} is confirmed. Departure: ${flightDetails.departure_time}`,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendFlightUpdate(email: string, flightStatus: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Flight Status Update',
      text: `Your flight status has been updated to: ${flightStatus}`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
